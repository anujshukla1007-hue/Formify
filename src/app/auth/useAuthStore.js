import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../api/client.js'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      sessions: {
        student: null,
        pilot: null,
        counselor: null,
        admin: null,
      },
      pendingIdentifierByRole: {},
      requestOtp: async ({ role, emailOrPhone }) => {
        try {
          const identifier = emailOrPhone.toLowerCase().trim()
          const response = await api.requestOtp({ role, identifier })
          set((state) => ({
            pendingIdentifierByRole: {
              ...state.pendingIdentifierByRole,
              [role]: identifier,
            },
          }))
          return { ok: true, message: `${response.message} (demo OTP: 246810)` }
        } catch (error) {
          return { ok: false, message: error.message || 'OTP request failed' }
        }
      },
      verifyOtp: async ({ role, code }) => {
        try {
          const identifier = get().pendingIdentifierByRole[role]
          if (!identifier) return { ok: false, message: 'No OTP request found' }
          const response = await api.verifyOtp({ role, identifier, code })
          set((state) => ({
            sessions: {
              ...state.sessions,
              [role]: {
                ...response.user,
                token: response.token,
                loginAt: new Date().toISOString(),
              },
            },
          }))
          return { ok: true }
        } catch (error) {
          return { ok: false, message: error.message || 'OTP verification failed' }
        }
      },
      logout: (role) =>
        set((state) => ({
          sessions: { ...state.sessions, [role]: null },
        })),
    }),
    {
      name: 'examapply-auth',
    },
  ),
)

