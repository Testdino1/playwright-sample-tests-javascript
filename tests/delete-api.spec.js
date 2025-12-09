import { test, expect } from "@playwright/test";

test.describe("DELETE User API", () => {

  test("DELETE: Remove user 1", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.delete("https://dummyjson.com/users/1");
    console.log("STATUS:", res.status());
    expect(res.status()).toBe(200);
  });

  test("DELETE: Remove non-existing user returns 200", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.delete("https://dummyjson.com/users/9999");
    console.log("STATUS:", res.status());
    expect(res.status()).toBe(200);
  });

  test("DELETE: Remove user twice", { tag: "@api @testdino" }, async ({ request }) => {
    await request.delete("https://dummyjson.com/users/5");
    const res = await request.delete("https://dummyjson.com/users/5");
    console.log("STATUS:", res.status());
    expect(res.status()).toBe(200);
  });

  test("DELETE: Validate body is returned", { tag: "@api @testdino" }, async ({ request }) => {
    const res = await request.delete("https://dummyjson.com/users/2");
    console.log(await res.json());
    expect(res.status()).toBe(200);
  });

});
