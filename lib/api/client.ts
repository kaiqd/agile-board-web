import { ApiError } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

class ApiRequestError extends Error {
  statusCode: number;
  apiError: string;

  constructor(error: ApiError) {
    const message = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message;
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = error.statusCode;
    this.apiError = error.error;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new ApiRequestError(error);
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

const headers = { "Content-Type": "application/json" };

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path));
  return handleResponse<T>(response);
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function patch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

export async function del<T = void>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), { method: "DELETE" });
  return handleResponse<T>(response);
}

export { ApiRequestError };
