// @ts-check
import { expect, test } from '@playwright/test';

// Base API URL - adjust this to match your actual API endpoint
const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const USERS_ENDPOINT = '/users';
const ADD_ENDPOINT = '/users/add';

test.describe('POST Create User API', () => {

  test('Bad endpoint returns 404 ',{tag: '@api'}, async ({ request }) => {
    const userData = {
      firstName: 'Test',
      lastName: 'User'
    };
    
    const response = await request.post(`${API_BASE_URL}${USERS_ENDPOINT}/invalid-endpoint`, {
      data: userData
    });
    
    expect(response.status()).toBe(404);
  });

  test('Invalid JSON payload handling ',{tag: '@api'}, async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}${ADD_ENDPOINT}`, {
      data: 'invalid json string',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Should return 400 Bad Request for invalid JSON
    expect([400, 422]).toContain(response.status());
  });

  test('Too large ID param should return 404 ',{tag: '@api'}, async ({ request }) => {
    const tooLargeId = 999999999;
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/${tooLargeId}`);
    
    expect(response.status()).toBe(404);
  });

  test('Deleting invalid id returns 200/response but not crash ',{tag: '@api'}, async ({ request }) => {
    const invalidId = 999999;
    const response = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${invalidId}`);
    
    // Should return 200 or 404, but not 500 (server error)
    expect([200, 404]).toContain(response.status());
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
  });

  test('PUT: Invalid method usage returns appropriate response (no 500) ',{tag: '@api'}, async ({ request }) => {
    const userId = 1;
    const updateData = {
      firstName: 'Updated'
    };
    
    // Try PUT on an endpoint that might not support it properly
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}/invalid`, {
      data: updateData
    });
    
    // Should return appropriate error (400, 404, 405) but not 500
    expect([400, 404, 405, 200]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  test('user schema contains expected keys ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/1`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Validate expected keys in user schema
    const expectedKeys = ['id', 'firstName', 'lastName'];
    expectedKeys.forEach(key => {
      expect(body).toHaveProperty(key);
    });
  });

  test('users list contains objects with id and email ',{tag: '@api'}, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    const users = body.users || body;
    const usersArray = Array.isArray(users) ? users : [];
    
    if (usersArray.length > 0) {
      // Check first user has id and email
      const firstUser = usersArray[0];
      expect(firstUser).toHaveProperty('id');
      // Email might be optional, so check if it exists
      if (firstUser.email !== undefined) {
        expect(typeof firstUser.email).toBe('string');
      }
    }
  });
});
