export class ApiError extends Error {
  readonly statusCode: number;
  readonly details?:   unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name       = 'ApiError';
    this.statusCode = statusCode;
    this.details    = details;
  }
}

export class ApiUnauthorizedError extends ApiError {
  constructor() {
    super('Unauthorized', 401);
    this.name = 'ApiUnauthorizedError';
  }
}

export class ApiNotFoundError extends ApiError {
  constructor(resource: string) {
    super(`Not found: ${resource}`, 404);
    this.name = 'ApiNotFoundError';
  }
}

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  body?:   unknown;
  signal?: AbortSignal;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path:   string,
  options: RequestOptions = {},
): Promise<T> {
  const url = new URL(path, window.location.origin);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (method !== 'GET' && options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    credentials: 'include',
    body: method !== 'GET' && options.body !== undefined
      ? JSON.stringify(options.body)
      : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    if (response.status === 401) throw new ApiUnauthorizedError();
    if (response.status === 404) throw new ApiNotFoundError(path);

    let message = `HTTP ${response.status}`;
    let details: unknown;
    try {
      const body = await response.json() as { error?: string; details?: unknown };
      if (body.error)   message = body.error;
      if (body.details) details = body.details;
    } catch { /* ignore parse errors */ }

    throw new ApiError(message, response.status, details);
  }

  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
}

export const apiGet = <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
  request<T>('GET', path, options);

export const apiPost = <T>(path: string, body: unknown, options?: RequestOptions) =>
  request<T>('POST', path, { ...options, body });

export const apiPut = <T>(path: string, body: unknown, options?: RequestOptions) =>
  request<T>('PUT', path, { ...options, body });

export const apiDelete = <T>(path: string, options?: RequestOptions) =>
  request<T>('DELETE', path, options);
