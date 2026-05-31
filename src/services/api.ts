import { User, ApiResponse, FormData } from '../types';

const REQRES_BASE = process.env.EXPO_PUBLIC_REQRES_BASE_URL!;
const REQRES_API_KEY = process.env.EXPO_PUBLIC_REQRES_API_KEY!;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key': REQRES_API_KEY,
        ...options?.headers,
      },
      ...options,
    });

    clearTimeout(timeout);
    console.log('📥 RESPONSE STATUS:', res.status, url);

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw err;
  }
}

export const api = {
  // Fetch paginated users from ReqRes
  getUsers: (page = 1): Promise<ApiResponse<User[]>> =>
    request<ApiResponse<User[]>>(`${REQRES_BASE}/users?page=${page}`),

  // Submit form data to ReqRes mock endpoint
  submitForm: (data: FormData): Promise<{ id: string; createdAt: string }> =>
    request(`${REQRES_BASE}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
