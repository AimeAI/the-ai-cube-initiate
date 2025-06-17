// Mock Stripe for testing
export const mockStripe = {
  redirectToCheckout: vi.fn().mockResolvedValue({ error: null }),
  confirmCardPayment: vi.fn().mockResolvedValue({ error: null, paymentIntent: {} }),
  createPaymentMethod: vi.fn().mockResolvedValue({ error: null, paymentMethod: {} }),
  retrievePaymentIntent: vi.fn().mockResolvedValue({ paymentIntent: {} }),
  
  // For server-side mocking
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({
        id: 'cs_test_mock_session_id',
        url: 'https://checkout.stripe.com/pay/cs_test_mock'
      }),
      listLineItems: vi.fn().mockResolvedValue({
        data: [{
          price: {
            id: 'price_mock',
            product: 'prod_mock'
          }
        }]
      })
    }
  },
  webhooks: {
    constructEvent: vi.fn().mockReturnValue({
      id: 'evt_mock',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_mock',
          customer_email: 'test@example.com',
          customer: 'cus_mock'
        }
      }
    })
  },
  customers: {
    create: vi.fn().mockResolvedValue({ id: 'cus_mock' }),
    retrieve: vi.fn().mockResolvedValue({ id: 'cus_mock' })
  }
};

export const loadStripe = vi.fn().mockResolvedValue(mockStripe);

export default class Stripe {
  constructor() {
    return mockStripe;
  }
}

// Named exports for server-side usage
export { mockStripe as Stripe };