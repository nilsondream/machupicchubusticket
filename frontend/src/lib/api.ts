export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: string
}

export interface RegisterPayload {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken?: string
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000/api"

const fetchJson = async (input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const message = data?.message ?? response.statusText
    throw new Error(message)
  }

  return response.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchJson(`${backendUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }) as Promise<AuthResponse>,

    register: (payload: RegisterPayload) =>
      fetchJson(`${backendUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify(payload),
      }) as Promise<{ user: AuthUser; accessToken: string }>,

    refresh: (refreshToken?: string) =>
      fetchJson(`${backendUrl}/auth/refresh`, {
        method: "POST",
        body: refreshToken ? JSON.stringify({ refreshToken }) : undefined,
      }) as Promise<AuthResponse>,

    logout: () =>
      fetchJson(`${backendUrl}/auth/logout`, {
        method: "POST",
      }),

    me: () =>
      fetchJson(`${backendUrl}/auth/me`, {
        method: "GET",
      }) as Promise<{ user: AuthUser }>,
  },
}