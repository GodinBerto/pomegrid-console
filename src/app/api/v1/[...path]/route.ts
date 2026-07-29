import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApiRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const DEFAULT_BACKEND_API_URL = "http://localhost:8000/api/v1/";

const REQUEST_HEADER_BLOCKLIST = new Set([
  "accept-encoding",
  "connection",
  "content-length",
  "host",
  "origin",
  "referer",
  "transfer-encoding",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
]);

const RESPONSE_HEADER_BLOCKLIST = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "transfer-encoding",
]);

const isLocalHost = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1" ||
  hostname.endsWith(".localhost");

const getBackendApiBaseUrl = () => {
  const configuredUrl =
    process.env.APP_API_URL ||
    process.env.CLOUD_HOSTED_URL ||
    process.env.NEXT_PUBLIC_APP_API_URL ||
    process.env.NEXT_PUBLIC_CLOUD_HOSTED_URL ||
    DEFAULT_BACKEND_API_URL;

  try {
    const url = new URL(configuredUrl);

    if (url.protocol === "http:" && !isLocalHost(url.hostname)) {
      url.protocol = "https:";
    }

    if (!url.pathname || url.pathname === "/") {
      url.pathname = "/api/v1/";
    } else if (!url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname}/`;
    }

    return url;
  } catch {
    return new URL(DEFAULT_BACKEND_API_URL);
  }
};

const joinUrlPath = (basePath: string, pathSegments: string[]) => {
  const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const requestPath = pathSegments.map(encodeURIComponent).join("/");
  return `${normalizedBasePath}${requestPath}`.replace(/\/{2,}/g, "/");
};

const buildBackendUrl = async (request: NextRequest, context: ApiRouteContext) => {
  const { path } = await context.params;
  const url = getBackendApiBaseUrl();

  url.pathname = joinUrlPath(url.pathname, path);
  url.search = request.nextUrl.search;

  return url;
};

const getForwardHeaders = (request: NextRequest) => {
  const headers = new Headers(request.headers);

  REQUEST_HEADER_BLOCKLIST.forEach((header) => headers.delete(header));

  return headers;
};

const getResponseHeaders = (headers: Headers) => {
  const responseHeaders = new Headers();

  headers.forEach((value, key) => {
    if (!RESPONSE_HEADER_BLOCKLIST.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return responseHeaders;
};

const proxyRequest = async (request: NextRequest, context: ApiRouteContext) => {
  const method = request.method;
  const targetUrl = await buildBackendUrl(request, context);
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers: getForwardHeaders(request),
      body: body && body.byteLength > 0 ? body : undefined,
      cache: "no-store",
    });

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: getResponseHeaders(upstreamResponse.headers),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown proxy error";

    return NextResponse.json(
      {
        success: false,
        status_code: 502,
        message: `Failed to reach backend API: ${message}`,
        data: null,
      },
      { status: 502 },
    );
  }
};

export function GET(request: NextRequest, context: ApiRouteContext) {
  return proxyRequest(request, context);
}

export function POST(request: NextRequest, context: ApiRouteContext) {
  return proxyRequest(request, context);
}

export function PUT(request: NextRequest, context: ApiRouteContext) {
  return proxyRequest(request, context);
}

export function PATCH(request: NextRequest, context: ApiRouteContext) {
  return proxyRequest(request, context);
}

export function DELETE(request: NextRequest, context: ApiRouteContext) {
  return proxyRequest(request, context);
}

export function HEAD(request: NextRequest, context: ApiRouteContext) {
  return proxyRequest(request, context);
}
