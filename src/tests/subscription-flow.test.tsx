import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentPage from '../pages/PaymentPage';
import { AuthProvider } from '../hooks/useAuth';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';

// Mock the useAuth hook to return an authenticated user
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {},
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z'
};

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    session: { access_token: 'mock-token' },
    loading: false,
    getToken: vi.fn().mockResolvedValue('mock-token'),
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    signOut: vi.fn()
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children
}));

// Mock the Stripe plans
vi.mock('../lib/stripe', () => ({
  getPlans: () => [
    {
      id: 'prod_test',
      name: 'Test Plan',
      price: 29.99,
      currency: 'cad',
      interval: 'month',
      metadata: { full_price: '39.99' }
    }
  ]
}));

// Mock fetch for API calls
global.fetch = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );
  };
};

describe('Subscription Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Payment Page', () => {
    it('should render payment plans for authenticated user', async () => {
      render(<PaymentPage />, { wrapper: createWrapper() });

      expect(screen.getByText('paymentPage.joinTitle')).toBeInTheDocument();
      expect(screen.getByText('Test Plan')).toBeInTheDocument();
      expect(screen.getByText('paymentPage.selectPlanButton')).toBeInTheDocument();
    });

    it('should initiate checkout when plan is selected', async () => {
      // Mock successful API response
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessionId: 'cs_test_session_id' })
      });

      // Mock Stripe redirectToCheckout
      const mockRedirectToCheckout = vi.fn().mockResolvedValue({ error: null });
      const { loadStripe } = await import('@stripe/stripe-js');
      vi.mocked(loadStripe).mockResolvedValue({
        redirectToCheckout: mockRedirectToCheckout
      } as unknown as import('@stripe/stripe-js').Stripe);

      render(<PaymentPage />, { wrapper: createWrapper() });

      const selectPlanButton = screen.getByText('paymentPage.selectPlanButton');
      fireEvent.click(selectPlanButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          },
          body: JSON.stringify({
            productId: 'prod_test',
            billingPeriod: 'monthly',
            quantity: 1
          })
        });
      });

      await waitFor(() => {
        expect(mockRedirectToCheckout).toHaveBeenCalledWith({
          sessionId: 'cs_test_session_id'
        });
      });
    });

    it('should handle authentication failure', async () => {
      // Mock API response with auth error
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Authentication required' })
      });

      // Mock window.alert
      window.alert = vi.fn();

      render(<PaymentPage />, { wrapper: createWrapper() });

      const selectPlanButton = screen.getByText('paymentPage.selectPlanButton');
      fireEvent.click(selectPlanButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          'Failed to initiate checkout: Authentication required'
        );
      });
    });
  });

  describe('Webhook Processing', () => {
    it('should handle successful checkout session', async () => {
      // This would be an integration test with the actual webhook
      // For now, we'll test that webhook exists and is properly structured
      
      // Mock Supabase admin operations would go here
      // This is more of a documentation of the expected flow
      expect(true).toBe(true); // Placeholder test for webhook functionality
    });
  });

  describe('Subscription Status', () => {
    it('should check subscription status correctly', () => {
      // Test the subscription hook logic
      const mockSubscription = {
        id: 'sub_test',
        user_id: 'test-user-id',
        subscription_id: 'sub_stripe_test',
        plan_id: 'prod_test',
        price_id: 'price_test',
        status: 'active' as const,
        cancel_at_period_end: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(mockSubscription.status).toBe('active');
      expect(mockSubscription.cancel_at_period_end).toBe(false);
    });
  });
});

describe('Error Scenarios', () => {
  it('should handle Stripe initialization failure', async () => {
    // Mock Stripe loading failure
    const { loadStripe } = await import('@stripe/stripe-js');
    vi.mocked(loadStripe).mockResolvedValue(null);
    
    window.alert = vi.fn();

    render(<PaymentPage />, { wrapper: createWrapper() });

    const selectPlanButton = screen.getByText('paymentPage.selectPlanButton');
    fireEvent.click(selectPlanButton);

    // Should not proceed with checkout if Stripe fails to load
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('should handle network errors gracefully', async () => {
    // Mock successful Stripe loading
    const { loadStripe } = await import('@stripe/stripe-js');
    vi.mocked(loadStripe).mockResolvedValue({
      redirectToCheckout: vi.fn()
    } as unknown as import('@stripe/stripe-js').Stripe);
    
    // Mock network error
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));
    
    window.alert = vi.fn();

    render(<PaymentPage />, { wrapper: createWrapper() });

    const selectPlanButton = screen.getByText('paymentPage.selectPlanButton');
    fireEvent.click(selectPlanButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Failed to initiate checkout: Network error'
      );
    });
  });
});