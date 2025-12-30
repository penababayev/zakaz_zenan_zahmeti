// lib/authApi.ts
export type AuthTokenResponse = {
  access_token: string;
  token_type: "bearer" | string;
};

// SIGNUP
export type SignupPayload = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  shop_name: string;
  location: string;
  phone_number: string;
  bio: string;
};

// LOGIN
export type LoginPayload = {
  username_or_email: string;
  password: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function signup(payload: SignupPayload): Promise<AuthTokenResponse> {
  return postJson<AuthTokenResponse>("/auth/signup", payload);
}

export async function login(payload: LoginPayload): Promise<AuthTokenResponse> {
  return postJson<AuthTokenResponse>("/auth/login", payload);
}
