import { describe, expect, it, vi } from "vitest";
import { NukleioClient } from "../src";

describe("NukleioClient", () => {
  it("adds authorization and returns userInfo", async () => {
    const fetchMock = vi.fn<typeof fetch>(async (_input, init) => {
      const headers = new Headers(init?.headers);
      expect(headers.get("Authorization")).toBe("Bearer nk_test");
      expect(headers.get("X-Target-User-Id")).toBe("user_123");
      return new Response(
        JSON.stringify({
          userInfo: {
            email: "ada@example.com",
            name: "Ada Lovelace",
            skills: [],
            experiences: [],
            projects: [],
            education: [],
            subscription: null,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });

    const client = new NukleioClient({
      apiKey: "nk_test",
      fetch: fetchMock,
      targetUserId: "user_123",
    });

    await expect(client.getUserData()).resolves.toMatchObject({
      email: "ada@example.com",
      name: "Ada Lovelace",
    });
  });

  it("throws a typed error for unsuccessful responses", async () => {
    const client = new NukleioClient({
      apiKey: "nk_test",
      fetch: async () =>
        new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 }),
    });

    await expect(client.getUserData()).rejects.toEqual(
      expect.objectContaining({
        name: "NukleioApiError",
        message: "Unauthorized",
        status: 401,
      }),
    );
  });

  it("rejects an empty API key", () => {
    expect(() => new NukleioClient({ apiKey: " " })).toThrow(TypeError);
  });
});
