# AI Cube Initiate 🎮

An innovative educational platform that teaches AI and machine learning concepts through interactive 3D games and simulations.

![AI Cube Initiate](https://aicube.ai/og-image.png)

## 🌟 Features

- **Interactive 3D Games**: Learn AI concepts through engaging WebGL-powered games
- **Multi-language Support**: Available in English and French-Canadian
- **Parent Dashboard**: Track your child's learning progress
- **Student Dashboard**: Personalized learning journey
- **Payment Integration**: Secure Stripe-powered subscriptions
- **Sacred AI Theme**: Mystical and futuristic UI design

## 🎯 Educational Games

- **Neural Network Chamber**: Visualize and interact with neural networks
- **Quantum Chamber**: Explore quantum computing concepts
- **Crystal Resonance**: Learn about data patterns and resonance
- **Predictor Engine**: Understand prediction algorithms
- **Decision Tree Game**: Master decision-making algorithms
- **Reinforcement Lab**: Experiment with reinforcement learning
- **Vision System**: Computer vision and image recognition
- **Snake 3**: Classic game with AI twist

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ai-cube-initiate.git
   cd ai-cube-initiate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   cp .env.example .env.server
   ```
   
   Edit `.env` and `.env.server` with your configuration values.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🔧 Configuration

### Environment Variables

#### Client-side (.env)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

#### Server-side (.env.server)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SIGNING_SECRET`: Stripe webhook secret
- `SESSION_SECRET`: Random 32-character string

### Supabase Setup

1. Create a new Supabase project
2. Enable authentication
3. Set up Row Level Security (RLS) policies
4. Configure email templates

### Stripe Setup

1. Create a Stripe account
2. Set up products and pricing
3. Configure webhooks endpoint: `/api/stripe-webhook`
4. Add webhook events: `checkout.session.completed`, `payment_intent.succeeded`

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── sacred/         # Sacred AI theme components
│   └── myth/           # Myth-themed components
├── pages/              # Page components
├── routes/             # Game route components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── server/             # Server-side code
│   ├── middleware/     # Express middleware
│   └── routes/         # API routes
└── styles/             # CSS styles
```

### Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Build Tool**: Vite
- **Testing**: Vitest, Testing Library
- **UI Components**: shadcn/ui (Radix UI)

## 🔐 Security

- ✅ Environment variables properly segregated
- ✅ API keys secured server-side only
- ✅ Authentication middleware on protected routes
- ✅ Rate limiting implemented
- ✅ CORS protection configured
- ✅ Input validation and sanitization

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure environment variables**
   - Add all client-side variables (VITE_*)
   - Add all server-side variables
3. **Deploy**
   ```bash
   npm run build
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Configure server-side environment variables**

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API endpoint and service tests
- **E2E Tests**: Full user workflow tests

## 📊 Monitoring

### Error Tracking

Production errors are automatically captured and logged. Consider integrating:

- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

### Performance Monitoring

- Bundle analyzer: `npm run analyze`
- Lighthouse CI for performance audits
- Web Vitals monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Use semantic commit messages
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.aicube.ai](https://docs.aicube.ai)
- **Issues**: [GitHub Issues](https://github.com/your-org/ai-cube-initiate/issues)
- **Email**: support@aicube.ai

## 🙏 Acknowledgments

- Built with ❤️ by AIME Intelligence
- Three.js community for 3D graphics inspiration
- React and Vite teams for amazing developer experience
- Supabase and Stripe for reliable infrastructure

---

**Made with 🚀 by the AI Cube team**