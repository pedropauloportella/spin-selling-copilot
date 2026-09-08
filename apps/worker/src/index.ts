import { createSession } from "./application/createSession";
import { processTranscript } from "./application/processTranscript";
import { SupabaseSessionRepository } from "./infrastructure/persistence/supabaseSessionRepository";
import { MockAnalyzer } from "./infrastructure/ai/mockAnalyzer";
import { OpenAIAnalyzer } from "./infrastructure/ai/openAIAnalyzer";
import { ResilientAnalyzer } from "./infrastructure/ai/resilientAnalyzer";
import { SupabaseAuth } from "./infrastructure/auth/supabaseAuth";

export interface Env {
  ENVIRONMENT: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

function repository(env: Env): SupabaseSessionRepository | undefined {
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  return env.SUPABASE_URL && key
    ? new SupabaseSessionRepository(env.SUPABASE_URL, key)
    : undefined;
}

function conversationAnalyzer(env: Env) {
  const fallback = new MockAnalyzer();
  return env.OPENAI_API_KEY && env.OPENAI_MODEL
    ? new ResilientAnalyzer(
        new OpenAIAnalyzer(env.OPENAI_API_KEY, env.OPENAI_MODEL),
        fallback
      )
    : fallback;
}

function authClient(env: Env): SupabaseAuth | undefined {
  return env.SUPABASE_URL && env.SUPABASE_ANON_KEY
    ? new SupabaseAuth(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
    : undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

function persistenceError(operation: string, error: unknown) {
  console.error(`Persistence failure while ${operation}.`, error);
  return json(
    {
      error: "The database is unavailable or its migrations have not been applied.",
      operation
    },
    503
  );
}

async function authenticatedUser(request: Request, env: Env) {
  const auth = authClient(env);
  if (!auth) {
    return { error: json({ error: "Supabase Auth is not configured." }, 503) };
  }

  try {
    const user = await auth.getUser(request.headers.get("authorization"));
    return user
      ? { user }
      : { error: json({ error: "A valid Bearer token is required." }, 401) };
  } catch (error) {
    console.error("Supabase Auth validation failed.", error);
    return { error: json({ error: "Authentication service is unavailable." }, 503) };
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "sales-copilot", sprint: "1" });
    }

    if (request.method === "POST" && url.pathname === "/sessions") {
      const body = await request.json().catch(() => undefined);
      if (!isObject(body) || typeof body.recordingConsent !== "boolean") {
        return json({ error: "recordingConsent (boolean) is required." }, 400);
      }
      const identity = await authenticatedUser(request, env);
      if (identity.error) return identity.error;

      const session = createSession({
        sellerId: identity.user.id,
        buyer: isObject(body.buyer) ? body.buyer : undefined,
        company: isObject(body.company) ? body.company : undefined,
        recordingConsent: body.recordingConsent,
        retentionDays: typeof body.retentionDays === "number" ? body.retentionDays : undefined
      });
      const store = repository(env);
      if (!store) {
        return json({ error: "Supabase is not configured." }, 503);
      }

      try {
        await store.create({
          id: session.sessionId,
          sellerId: identity.user.id,
          buyerName: session.context.buyer?.name,
          companyName: session.context.company?.name,
          sector: session.context.company?.sector,
          recordingConsent: session.recordingConsent,
          retentionDays: session.retentionDays,
          context: session.context
        });
      } catch (error) {
        return persistenceError("creating a session", error);
      }
      return json(session, 201);
    }

    if (request.method === "POST" && url.pathname === "/transcript") {
      const body = await request.json().catch(() => undefined);
      if (!isObject(body) || typeof body.sessionId !== "string" || typeof body.buyerUtterance !== "string") {
        return json({ error: "sessionId and buyerUtterance are required." }, 400);
      }
      const identity = await authenticatedUser(request, env);
      if (identity.error) return identity.error;
      const store = repository(env);
      if (!store) {
        return json({ error: "Supabase is not configured." }, 503);
      }

      let session;
      try {
        session = await store.findById(body.sessionId, identity.user.id);
      } catch (error) {
        return persistenceError("loading a session", error);
      }
      if (!session) return json({ error: "Session not found." }, 404);
      if (!session.recording_consent) {
        return json({ error: "Recording consent is required before processing a transcript." }, 403);
      }

      const result = await processTranscript({
        sessionId: body.sessionId,
        buyerUtterance: body.buyerUtterance,
        context: session.sales_context,
        analyzer: conversationAnalyzer(env)
      });
      try {
        await Promise.all([
          store.addBuyerTurn(body.sessionId, body.buyerUtterance),
          store.updateContext(body.sessionId, result.context)
        ]);
      } catch (error) {
        return persistenceError("saving a transcript", error);
      }
      return json(result);
    }

    return json({ error: "Not Found" }, 404);
  }
};
