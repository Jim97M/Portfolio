export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://portfolio.waridi.org").replace(/\/$/, "");

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  coverImageUrl: string | null;
  videoUrl: string | null;
  videoPosterUrl: string | null;
  captionsUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  role: string;
  summary: string;
  description: string;
  techStack: string[];
  imageUrl: string | null;
  liveUrl: string | null;
  sourceUrl: string | null;
  featured: boolean;
  sortOrder: number;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiError = { error?: string; details?: Array<{ message?: string }> };

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(`Cannot reach the API at ${API_BASE_URL}. Check that the backend is running.`);
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null) as ApiError | T | null;
  if (!response.ok) {
    const apiError = payload as ApiError | null;
    throw new Error(apiError?.error || `Request failed (${response.status}).`);
  }

  return payload as T;
}