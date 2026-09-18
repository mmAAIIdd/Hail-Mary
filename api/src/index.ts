import { GoogleGenAI } from '@google/genai';
import {
  admissionsPlanSchema,
  profileSchema,
  responseJsonSchema,
} from './contracts';
import { buildAdmissionsPrompt, SYSTEM_INSTRUCTION } from './prompt';

interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
  ALLOWED_ORIGINS: string;
}

const requestLog = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 4;

function edgeCache(): Cache {
  return (caches as unknown as { default: Cache }).default;
}

function allowedOrigins(env: Env): Set<string> {
  return new Set(env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean));
}

function corsHeaders(origin: string | null, env: Env): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (origin && allowedOrigins(env).has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function jsonResponse(body: unknown, status: number, origin: string | null, env: Env): Response {
  return Response.json(body, {
    status,
    headers: {
      ...corsHeaders(origin, env),
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function isRateLimited(request: Request): boolean {
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter((timestamp) => now - timestamp < 60_000);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_MINUTE;
}

async function cacheKey(profile: unknown): Promise<Request> {
  const encoded = new TextEncoder().encode(`v1:${JSON.stringify(profile)}`);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  const hash = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return new Request(`https://hail-mary-cache.internal/${hash}`);
}

function sanitizePlan(rawText: string) {
  const parsed = admissionsPlanSchema.parse(JSON.parse(rawText));
  const sources = parsed.sources.filter(
    (source, index, items) => items.findIndex((item) => item.url === source.url) === index,
  );

  return {
    ...parsed,
    universities: parsed.universities.map((university) => ({
      ...university,
      annual_cost: {
        ...university.annual_cost,
        max_usd: Math.max(university.annual_cost.min_usd, university.annual_cost.max_usd),
      },
    })),
    sources,
  };
}

async function handlePlan(request: Request, env: Env, origin: string | null): Promise<Response> {
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 20_000) {
    return jsonResponse({ error: 'Анкета слишком большая.' }, 413, origin, env);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 20_000) {
      return jsonResponse({ error: 'Анкета слишком большая.' }, 413, origin, env);
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: 'Некорректный формат запроса.' }, 400, origin, env);
  }

  const validation = profileSchema.safeParse((body as { profile?: unknown })?.profile);
  if (!validation.success) {
    return jsonResponse({ error: 'Проверьте данные анкеты и попробуйте снова.' }, 400, origin, env);
  }
  const key = await cacheKey(validation.data);
  const cached = await edgeCache().match(key);
  if (cached) {
    const cachedHeaders = new Headers(cached.headers);
    const responseCorsHeaders = new Headers(corsHeaders(origin, env));
    responseCorsHeaders.forEach((value, header) => cachedHeaders.set(header, value));
    cachedHeaders.set('X-Cache', 'HIT');
    return new Response(cached.body, {
      status: cached.status,
      headers: cachedHeaders,
    });
  }
  if (!env.GEMINI_API_KEY) {
    return jsonResponse({ error: 'Сервис рекомендаций ещё не настроен.' }, 503, origin, env);
  }
  if (isRateLimited(request)) {
    return jsonResponse({ error: 'Слишком много запросов. Повторите через минуту.' }, 429, origin, env);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: buildAdmissionsPrompt(validation.data),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseJsonSchema,
        temperature: 0.2,
        maxOutputTokens: 8_192,
      },
    });

    if (!response.text) throw new Error('Gemini returned an empty response');
    const plan = sanitizePlan(response.text);
    const result = {
      ...plan,
      generated_at: new Date().toISOString(),
      model: env.GEMINI_MODEL || 'gemini-2.5-flash',
    };
    const responseBody = JSON.stringify(result);
    const cacheResponse = new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=21600',
      },
    });
    await edgeCache().put(key, cacheResponse);

    return new Response(responseBody, {
      headers: {
        ...corsHeaders(origin, env),
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'private, max-age=300',
        'X-Cache': 'MISS',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Admissions plan generation failed', error instanceof Error ? error.message : error);
    return jsonResponse({ error: 'Не удалось построить рекомендации. Попробуйте ещё раз позже.' }, 502, origin, env);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (origin && !allowedOrigins(env).has(origin)) {
      return jsonResponse({ error: 'Источник запроса не разрешён.' }, 403, origin, env);
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }
    if (url.pathname === '/health' && request.method === 'GET') {
      return jsonResponse({ status: 'ok', model: env.GEMINI_MODEL }, 200, origin, env);
    }
    if (url.pathname === '/api/plan' && request.method === 'POST') {
      return handlePlan(request, env, origin);
    }
    return jsonResponse({ error: 'Маршрут не найден.' }, 404, origin, env);
  },
} satisfies ExportedHandler<Env>;
