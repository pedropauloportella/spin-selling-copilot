export interface AuthenticatedUser {
  id: string;
}

type FetchLike = typeof fetch;

export class SupabaseAuth {
  constructor(
    private readonly url: string,
    private readonly publishableKey: string,
    private readonly request: FetchLike = (...args) => fetch(...args)
  ) {}

  async getUser(authorization: string | null): Promise<AuthenticatedUser | undefined> {
    if (!authorization?.startsWith("Bearer ")) {
      return undefined;
    }

    const response = await this.request(`${this.url}/auth/v1/user`, {
      headers: {
        apikey: this.publishableKey,
        authorization
      }
    });

    if (!response.ok) {
      return undefined;
    }

    const body = await response.json() as { id?: unknown };
    return typeof body.id === "string" ? { id: body.id } : undefined;
  }
}
