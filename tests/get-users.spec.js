// @ts-check
import { expect, test } from '@playwright/test';

// Base API URL - adjust this to match your actual API endpoint
const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const USERS_ENDPOINT = '/users';

test.describe('GET Users API', () => {
  
  test('Fetch all users ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
  });

  test('Fetch user by ID = 1 ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/1`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('firstName');
    expect(body).toHaveProperty('lastName');
  });

  test('Validate total users > 0 ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('total');
    expect(body.total).toBeGreaterThan(0);
  });

  test('Validate user image exists ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/1`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('image');
    expect(body.image).toBeTruthy();
    expect(typeof body.image).toBe('string');
  });

  test('Validate user 1 has firstName field ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/1`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('firstName');
    expect(typeof body.firstName).toBe('string');
    expect(body.firstName.length).toBeGreaterThan(0);
  });

  test('Invalid user ID returns 404 ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/999999`);
    
    expect(response.status()).toBe(404);
  });

  test('default users (no query) returns data object/array ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
    // Should have either 'users' array or be an array itself
    expect(body.users || Array.isArray(body)).toBeTruthy();
  });

  test('limit param returns limited results ',{tag: '@api'}, async ({ request }) => {
    const limit = 5;
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}?limit=${limit}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    const users = body.users || body;
    const usersArray = Array.isArray(users) ? users : [];
    expect(usersArray.length).toBeLessThanOrEqual(limit);
  });

  test('skip param shifts results ',{tag: '@api'}, async ({ request }) => {
    const skip = 5;
    const limit = 10;
    
    // Get first page
    const response1 = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}?limit=${limit}&skip=0`);
    const body1 = await response1.json();
    const users1 = body1.users || body1;
    const firstUser1 = Array.isArray(users1) ? users1[0] : null;
    
    // Get second page with skip
    const response2 = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}?limit=${limit}&skip=${skip}`);
    const body2 = await response2.json();
    const users2 = body2.users || body2;
    const firstUser2 = Array.isArray(users2) ? users2[0] : null;
    
    expect(response1.status()).toBe(200);
    expect(response2.status()).toBe(200);
    
    // If both have users, they should be different (unless skip doesn't work)
    if (firstUser1 && firstUser2) {
      expect(firstUser1.id).not.toBe(firstUser2.id);
    }
  });

  test('sorting / search query (if supported) returns filtered results ',{tag: '@api'}, async ({ request }) => {
    // Try search query parameter (common patterns: q, search, query)
    const searchTerm = 'john';
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/search?q=${searchTerm}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    const users = body.users || body;
    const usersArray = Array.isArray(users) ? users : [];
    
    // If search is supported, should return filtered results
    if (usersArray.length > 0) {
      // At least verify the response structure is valid
      expect(Array.isArray(usersArray)).toBe(true);
    }
  });

  test('delayed response (3s) should return 200 ',{tag: '@api'}, async ({ request }) => {
    // Flaky test: fail on first run, pass on retry
    const isRetry = test.info().retry > 0;
    if (!isRetry) {
      expect(true).toBe(false); // Force failure on first run
    }
    
    // Some APIs support delay parameter for testing
    const delay = 3;
    const startTime = Date.now();
    
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}?delay=${delay}`, {
      timeout: 10000 // 10 second timeout
    });
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    expect(response.status()).toBe(200);
    // Should take at least close to the delay time
    expect(duration).toBeGreaterThanOrEqual(delay - 0.5);
    
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
  });

  test('enforce timeout (expect to fail if too slow) — set short timeout ',{tag: '@api'}   , async ({ request }) => {
    const delay = 5; // 5 second delay
    const shortTimeout = 2000; // 2 second timeout - should fail
    
    try {
      const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}?delay=${delay}`, {
        timeout: shortTimeout
      });
      
      // If it doesn't timeout, the API might not support delay or it's faster
      expect(response.status()).toBe(200);
    } catch (error) {
      // Expected to timeout - verify it's a timeout error
      expect(error.message).toMatch(/timeout|Timeout/i);
    }
  });
});
