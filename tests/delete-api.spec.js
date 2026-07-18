// @ts-check
import { expect, test } from '@playwright/test';

// Base API URL - adjust this to match your actual API endpoint
const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const USERS_ENDPOINT = '/users';

test.describe('DELETE User API', () => {
  
  test('Remove user 1 ',{tag: '@api'}, async ({ request }) => {
    const userId = 1;
    const response = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id', userId);
    expect(body).toHaveProperty('isDeleted', true);
  });

  test('Remove user twice ',{tag: '@api'}, async ({ request }) => {
    const userId = 2;
    
    // First deletion
    const response1 = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`);
    expect(response1.status()).toBe(200);
    const body1 = await response1.json();
    expect(body1).toHaveProperty('id', userId);
    
    // Second deletion attempt (should still return 200, but user is already deleted)
    const response2 = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`);
    expect(response2.status()).toBe(200);
    const body2 = await response2.json();
    expect(body2).toHaveProperty('id', userId);
  });

  test('Validate body is returned ',{tag: '@api'}, async ({ request }) => {
    const userId = 3;
    const response = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Validate response body structure
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
  });
});
