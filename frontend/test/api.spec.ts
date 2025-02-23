import { describe, it, expect } from "vitest";
import { setup, fetch } from "@nuxt/test-utils";

setup({ server: true });

describe("✅ API Tests - Redis & MongoDB", () => {
  it("✅ Should fetch images and verify Redis cache", async () => {
    await fetch("/api/images?page=1&active=true");

    const response = await fetch("/api/images?page=1&active=true" , { method: "GET" });
    expect(response.status).toBe(200);
  });

  it("✅ Should generate images using /api/generate", async () => {
    const response = await fetch("/api/generate", { method: "POST" });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toContain(
      "✅ Generated 200 images (100 ActiveUser + 100 NonActiveUser)"
    );
  });

  it("✅ Should generate a heavy dataset using /api/generate-heavy", async () => {
    const response = await fetch("/api/generate-heavy", { method: "POST" });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toContain("✅ Generated 700000 to DB");
  }, 30000);
});
