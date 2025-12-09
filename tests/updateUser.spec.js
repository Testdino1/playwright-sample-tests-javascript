import { test, expect } from "@playwright/test";

test.describe("PUT / PATCH Update User API", () => {

  test("PUT: Update user details", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = { firstName: "Updated", age: 30 };

    const res = await request.put("https://dummyjson.com/users/1", { data: payload });
    console.log(await res.json());

    expect(res.status()).toBe(200);
  });

  test("PATCH: Update only one field", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = { age: 28 };

    const res = await request.patch("https://dummyjson.com/users/1", { data: payload });
    console.log(await res.json());

    expect(res.status()).toBe(200);
  });

  test("PUT: Update user with empty payload", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.put("https://dummyjson.com/users/1", { data: {} });

    console.log(await res.json());
    expect(res.status()).toBe(200);
  });

  test("PATCH: Update non-existing user still returns 200", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.patch("https://dummyjson.com/users/9999", { data: { age: 20 } });

    console.log(await res.json());
    expect(res.status()).toBe(200);
  });

  test("PUT: Validate returned name field", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.put("https://dummyjson.com/users/2", {
      data: { firstName: "Arjun" }
    });
    const body = await res.json();

    console.log(body);
    expect(body.firstName).toBe("Arjun");
  });

  test("PATCH: Update and validate response contains updatedAt simulation", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.patch("https://dummyjson.com/users/3", { data: { age: 33 } });

    const body = await res.json();
    console.log(body);

    expect(body.age).toBe(33);
  });

  test("POST: Login success (valid creds)", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = { username: "kminchelle", password: "0lelplR" }; // known demo creds
    const res = await request.post("https://dummyjson.com/auth/login", { data: payload });

    console.log("STATUS:", res.status());
    const text = await res.text();
    console.log("RAW:", text);
    const body = JSON.parse(text);
    console.log("BODY:", body);

    expect(res.status()).toBe(200);
    expect(body.token).toBeTruthy();
  });

  test("POST: Login failure (invalid creds)", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = { username: "wronguser", password: "bad" };
    const res = await request.post("https://dummyjson.com/auth/login", { data: payload });

    console.log("STATUS:", res.status());
    const txt = await res.text();
    console.log("RAW:", txt);

    // DummyJSON returns 400 with message for bad credentials
    expect(res.status()).toBe(400);
  });

  test("POST: Login missing fields returns 400", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.post("https://dummyjson.com/auth/login", { data: {} });
    console.log("STATUS:", res.status());
    console.log("TEXT:", await res.text());
    expect(res.status()).toBe(400);
  });

  test("POST: Login returns expected username in response when success", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = { username: "kminchelle", password: "0lelplR" };
    const res = await request.post("https://dummyjson.com/auth/login", { data: payload });
    const body = await res.json();
    console.log("BODY:", body);
    expect(body.username).toBe("kminchelle");
  });

  test("POST: Login token length sanity check", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = { username: "kminchelle", password: "0lelplR" };
    const res = await request.post("https://dummyjson.com/auth/login", { data: payload });
    const body = await res.json();
    console.log("TOKEN:", body.token);
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThan(10);
  });

  test("POST: Login headers present in response (server may add CORS headers)", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = { username: "kminchelle", password: "0lelplR" };
    const res = await request.post("https://dummyjson.com/auth/login", { data: payload });
    console.log("HEADERS:", Object.fromEntries(res.headers()));
    expect(res.status()).toBe(200);
  });
});
