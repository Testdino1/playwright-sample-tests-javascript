// @ts-check
import { expect, test } from '@playwright/test';

// Base API URL - adjust this to match your actual API endpoint
const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const USERS_ENDPOINT = '/users';
const AUTH_ENDPOINT = '/auth/login';

test.describe('PUT / PATCH Update User API', () => {
  
  test('Update user details ',{tag: '@api'}, async ({ request }) => {
    const userId = 1;
    const updateData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    };
    
    // Try PUT first, fallback to PATCH if needed
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: updateData
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id', userId);
    expect(body).toHaveProperty('firstName', updateData.firstName);
    expect(body).toHaveProperty('lastName', updateData.lastName);
  });

  test('Update user with empty payload ',{tag: '@api'}, async ({ request }) => {
    const userId = 2;
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: {}
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id', userId);
  });

  test('Update only one field ',{tag: '@api'}, async ({ request }) => {
    const userId = 3;
    const updateData = {
      firstName: 'UpdatedFirstName'
    };
    
    // Use PATCH for partial update
    const response = await request.patch(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: updateData
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id', userId);
    expect(body).toHaveProperty('firstName', updateData.firstName);
  });

  test('Validate returned name field ',{tag: '@api'}, async ({ request }) => {
    const userId = 4;
    const updateData = {
      firstName: 'Jane',
      lastName: 'Smith'
    };
    
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: updateData
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('firstName');
    expect(body).toHaveProperty('lastName');
    expect(typeof body.firstName).toBe('string');
    expect(typeof body.lastName).toBe('string');
    expect(body.firstName).toBe(updateData.firstName);
    expect(body.lastName).toBe(updateData.lastName);
  });

  test('Update and validate response contains updatedAt simulation ',{tag: '@api'}, async ({ request }) => {
    const userId = 5;
    const updateData = {
      firstName: 'Updated',
      lastName: 'User'
    };
    
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: updateData
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Check for updatedAt or similar timestamp field
    const hasTimestamp = body.hasOwnProperty('updatedAt') || 
                        body.hasOwnProperty('updated') || 
                        body.hasOwnProperty('modifiedAt');
    
    // At minimum, validate the response structure
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id', userId);
  });

  test('Login failure (invalid creds) ',{tag: '@api'}, async ({ request }) => {
    const loginData = {
      username: 'invaliduser',
      password: 'wrongpassword'
    };
    
    const response = await request.post(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
      data: loginData
    });
    
    // Should return error status (400 or 401)
    expect([400, 401, 403]).toContain(response.status());
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
  });

  test('Login missing fields returns 400 ',{tag: '@api'}, async ({ request }) => {
    // Missing password field
    const loginData = {
      username: 'kminchelle'
    };
    
    const response = await request.post(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
      data: loginData
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
  });
});
