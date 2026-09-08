import type { SalesContext } from "../../domain/salesContext";

export interface StoredSession {
  id: string;
  status: string;
  recording_consent: boolean;
  sales_context: SalesContext;
}

interface SupabaseSessionRow {
  id: string;
  status: string;
  recording_consent: boolean;
  sales_context: SalesContext | null;
}

export class SupabaseSessionRepository {
  constructor(
    private readonly url: string,
    private readonly key: string
  ) {}

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${this.url}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: this.key,
        authorization: `Bearer ${this.key}`,
        "content-type": "application/json",
        prefer: "return=representation",
        ...init.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase request failed (${response.status}).`);
    }

    return response.json() as Promise<T>;
  }

  async create(input: {
    id: string;
    sellerId: string;
    buyerName?: string;
    companyName?: string;
    sector?: string;
    recordingConsent: boolean;
    retentionDays: number;
    context: SalesContext;
  }): Promise<StoredSession> {
    const retentionExpiresAt = new Date(
      Date.now() + input.retentionDays * 24 * 60 * 60 * 1000
    ).toISOString();
    const rows = await this.request<SupabaseSessionRow[]>("sales_sessions", {
      method: "POST",
      body: JSON.stringify({
        id: input.id,
        seller_id: input.sellerId,
        buyer_name: input.buyerName,
        company_name: input.companyName,
        sector: input.sector,
        recording_consent: input.recordingConsent,
        consent_timestamp: input.recordingConsent ? new Date().toISOString() : null,
        retention_expires_at: retentionExpiresAt,
        sales_context: input.context
      })
    });

    return this.toStoredSession(rows[0]);
  }

  async findById(id: string, sellerId: string): Promise<StoredSession | undefined> {
    const rows = await this.request<SupabaseSessionRow[]>(
      `sales_sessions?id=eq.${encodeURIComponent(id)}&seller_id=eq.${encodeURIComponent(sellerId)}&select=id,status,recording_consent,sales_context`,
      { method: "GET" }
    );
    return rows[0] ? this.toStoredSession(rows[0]) : undefined;
  }

  async updateContext(id: string, context: SalesContext): Promise<void> {
    await this.request<unknown>(`sales_sessions?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ sales_context: context })
    });
  }

  async addBuyerTurn(sessionId: string, transcript: string): Promise<void> {
    await this.request<unknown>("conversation_turns", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        speaker: "BUYER",
        transcript
      })
    });
  }

  private toStoredSession(row: SupabaseSessionRow | undefined): StoredSession {
    if (!row || !row.sales_context) {
      throw new Error("The stored session has no sales context.");
    }
    return {
      id: row.id,
      status: row.status,
      recording_consent: row.recording_consent,
      sales_context: row.sales_context
    };
  }
}
