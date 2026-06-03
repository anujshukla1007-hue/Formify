const API_BASE = 'https://wcbeqxnufyxcqismgvyc.supabase.co/rest/v1'
  const makeIdempotencyKey = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`

export async function apiFetch(path, options = {}, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })
  let data
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export const api = {
  health: () => apiFetch('/health'),
  getPublicExams: () => apiFetch('/public/exams'),
  requestOtp: (payload) => apiFetch('/auth/request-otp', { method: 'POST', body: JSON.stringify(payload) }),
  verifyOtp: (payload) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) }),
  getPilotTasks: (token) => apiFetch('/pilot/tasks', {}, token),
  taskAction: (id, action, reason, token) =>
    apiFetch(
      `/pilot/tasks/${id}/action`,
      {
        method: 'POST',
        body: JSON.stringify({ action, reason }),
        headers: { 'x-idempotency-key': makeIdempotencyKey() },
      },
      token,
    ),
  getCounselorSlots: (token) => apiFetch('/counselor/slots', {}, token),
  getAdminMetrics: (token) => apiFetch('/admin/metrics', {}, token),
  getWorkforce: (token) => apiFetch('/admin/workforce', {}, token),
  addWorkforce: (payload, token) =>
    apiFetch(
      '/admin/workforce',
      { method: 'POST', body: JSON.stringify(payload), headers: { 'x-idempotency-key': makeIdempotencyKey() } },
      token,
    ),
  toggleKyc: (id, token) =>
    apiFetch(
      `/admin/workforce/${id}/toggle-kyc`,
      { method: 'POST', headers: { 'x-idempotency-key': makeIdempotencyKey() } },
      token,
    ),
  toggleActive: (id, reason, token) =>
    apiFetch(
      `/admin/workforce/${id}/toggle-active`,
      { method: 'POST', body: JSON.stringify({ reason }), headers: { 'x-idempotency-key': makeIdempotencyKey() } },
      token,
    ),
  processRefund: (payload, token) =>
    apiFetch(
      '/admin/refund',
      { method: 'POST', body: JSON.stringify(payload), headers: { 'x-idempotency-key': makeIdempotencyKey() } },
      token,
    ),
}

