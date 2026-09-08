import { describe, expect, it, vi } from "vitest";
import { SupabaseAuth } from "../src/infrastructure/auth/supabaseAuth";

describe("SupabaseAuth", () => {
  it("validates a bearer token with the Supabase Auth service", async () => {
    const request = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "c053d6f0-e980-4c4f-9de1-76f6fe183374" }), { status: 200 })
    );
    const auth = new SupabaseAuth("https://example.supabase.co", "publishable-key", request);

    await expect(auth.getUser("Bearer valid-token")).resolves.toEqual({
      id: "c053d6f0-e980-4c4f-9de1-76f6fe183374"
    });
    expect(request).toHaveBeenCalledWith(
      "https://example.supabase.co/auth/v1/user",
      expect.objectContaining({ headers: expect.objectContaining({ authorization: "Bearer valid-token" }) })
    );
  });

  it("rejects a missing bearer token without making a network request", async () => {
    const request = vi.fn();
    const auth = new SupabaseAuth("https://example.supabase.co", "publishable-key", request);

    await expect(auth.getUser(null)).resolves.toBeUndefined();
    expect(request).not.toHaveBeenCalled();
  });
});
