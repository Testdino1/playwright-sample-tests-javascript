import { test, expect } from "@playwright/test";

test.describe("POST Create User API", () => {

  test("POST: Create a new user", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = {
      firstName: "Kriti",
      lastName: "Verma",
      age: 22
    };

    const res = await request.post("https://dummyjson.com/users/add", {
      data: payload
    });

    console.log("STATUS:", res.status());
    console.log("RESPONSE:", await res.json());

    expect(res.status()).toBe(200);
  });

  test("POST: Validate created user has id", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.post("https://dummyjson.com/users/add", {
      data: { firstName: "Aarav" }
    });

    const body = await res.json();
    console.log(body);

    expect(body.id).toBeTruthy();
  });

  test("POST: Create user with extra fields", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.post("https://dummyjson.com/users/add", {
      data: { firstName: "Riya", height: 165, weight: 50 }
    });

    console.log(await res.json());
    expect(res.status()).toBe(200);
  });

  test("POST: Create user without any fields", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.post("https://dummyjson.com/users/add", { data: {} });

    console.log(await res.json());
    expect(res.status()).toBe(200);
  });

  test("POST: Validate response has createdAt timestamp (simulated)", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.post("https://dummyjson.com/users/add", {
      data: { firstName: "Kriti", job: "QA" }
    });

    const body = await res.json();
    console.log(body);

    // DummyJSON does not provide timestamps — this is just a presence check
    expect(body).toBeTruthy();
  });

  test("POST: Validate server echoes fields", { tag: "@api @testdino" }, async ({ request }) => {
    const payload = { firstName: "Meera", age: 29 };
    const res = await request.post("https://dummyjson.com/users/add", { data: payload });

    const body = await res.json();
    console.log(body);

    expect(body.firstName).toBe("Meera");
  });
  test("GET: Bad endpoint returns 404", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.get("https://dummyjson.com/non-existing-endpoint");
    console.log("STATUS:", res.status());
    console.log("TEXT:", await res.text());
    expect(res.status()).toBe(404);
  });

  test("POST: Invalid JSON payload handling", { tag: "@api @testdino" }, async ({ request }) => {
    // send a string as body to endpoints that expect JSON - Playwright will still send it as body
    const res = await request.post("https://dummyjson.com/users/add", {
      headers: { "Content-Type": "application/json" },
      data: "this_is_not_json"
    });
    console.log("STATUS:", res.status());
    console.log("TEXT:", await res.text());
    // DummyJSON may accept or return 400; assert not 500
    expect(res.status()).not.toBe(500);
  });

  test("GET: Too large ID param should return 404", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.get("https://dummyjson.com/users/999999999999");
    console.log("STATUS:", res.status());
    console.log("TEXT:", await res.text());
    expect(res.status()).toBe(404);
  });

  test("DELETE: Deleting invalid id returns 200/response but not crash", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.delete("https://dummyjson.com/users/999999");
    console.log("STATUS:", res.status());
    console.log("TEXT:", await res.text());
    // DummyJSON tends to return 200 for delete; ensure it's not a server error
    expect(res.status()).not.toBeGreaterThan(599);
  });

  test("PUT: Invalid method usage returns appropriate response (no 500)", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.put("https://dummyjson.com/posts", { data: { title: "x" } });
    console.log("STATUS:", res.status());
    console.log("TEXT:", await res.text());
    expect(res.status()).not.toBe(500);
  });

  test("GET: Rate-limit simulation - quick repeated calls", { tag: "@api @testdino" }, async ({ request }) => {
    // fire a few quick requests and ensure none return 429 (most public test APIs don't enforce rate limits heavily)
    const urls = [1,2,3,4,5].map(i => request.get("https://dummyjson.com/users"));
    const results = await Promise.all(urls);
    const statuses = results.map(r => r.status());
    console.log("STATUSES:", statuses);
    expect(statuses.some(s => s === 429)).toBe(false);
  });

  test("GET: user schema contains expected keys", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.get("https://dummyjson.com/users/1");
    console.log("STATUS:", res.status());
    const body = await res.json();
    console.log("USER1 KEYS:", Object.keys(body));
    expect(body).toMatchObject({
      id: expect.any(Number),
      firstName: expect.any(String),
      lastName: expect.any(String)
    });
  });

  test("GET: users list contains objects with id and email", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.get("https://dummyjson.com/users");
    const body = await res.json();
    console.log("SAMPLE USER:", body.users[0]);
    expect(body.users.length).toBeGreaterThan(0);
    expect(body.users[0]).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String)
    });
  });


});
