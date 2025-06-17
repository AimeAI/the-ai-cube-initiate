/// <reference types="vitest/globals" />
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Supabase
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn().mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
          error: null
        }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } }
        }),
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null, session: null },
          error: null
        }),
        signUp: vi.fn().mockResolvedValue({
          data: { user: null, session: null },
          error: null
        }),
        signOut: vi.fn().mockResolvedValue({ error: null })
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' }
            })
          })
        })
      })
    })
  };
});

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    redirectToCheckout: vi.fn().mockResolvedValue({ error: null })
  })
}));

// Mock Three.js
vi.mock('three', () => ({
  Scene: vi.fn().mockImplementation(() => ({})),
  PerspectiveCamera: vi.fn().mockImplementation(() => ({})),
  WebGLRenderer: vi.fn().mockImplementation(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    domElement: document.createElement('canvas')
  })),
  Mesh: vi.fn().mockImplementation(() => ({})),
  BoxGeometry: vi.fn().mockImplementation(() => ({})),
  MeshBasicMaterial: vi.fn().mockImplementation(() => ({}))
}));

// Mock react-three-fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => children,
  useFrame: vi.fn(),
  useThree: vi.fn().mockReturnValue({
    camera: {},
    scene: {},
    gl: {}
  })
}));

// Mock Tone.js
vi.mock('tone', () => ({
  start: vi.fn().mockResolvedValue(undefined),
  Synth: vi.fn().mockImplementation(() => ({
    toDestination: vi.fn().mockReturnThis(),
    triggerAttackRelease: vi.fn()
  }))
}));

// Mock react-helmet-async to fix the common error
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => children,
  HelmetProvider: ({ children }: { children: React.ReactNode }) => children
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en'
    }
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn()
  }
}));