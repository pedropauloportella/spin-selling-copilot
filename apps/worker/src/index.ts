import { createSession } from "./application/createSession";
import { processTranscript } from "./application/processTranscript";

export interface Env {
  ENVIRONMENT: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "sales-copilot", sprint: "1" });
    }

    if (request.method === "POST" && url.pathname === "/sessions") {
      const body = await request.json().catch(() => ({}));
      return json(createSession(body));
    }

    if (request.method === "POST" && url.pathname === "/transcript") {
      const body = await request.json().catch(() => ({}));
      return json(processTranscript(body));
    }

    return json({ error: "Not Found" }, 404);
  }
};
