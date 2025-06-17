// Mock Supabase client for testing
export const mockSupabaseClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({
      error: null
    }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    }),
    admin: {
      getUserByEmail: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null
      })
    }
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        })
      })
    }),
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [],
        error: null
      })
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null
      })
    }),
    upsert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: null
        })
      })
    })
  }),
  channel: vi.fn().mockReturnValue({
    on: vi.fn().mockReturnValue({
      subscribe: vi.fn()
    })
  })
};

export const createClient = vi.fn().mockReturnValue(mockSupabaseClient);

// Mock the actual supabase client export
export const supabase = mockSupabaseClient;