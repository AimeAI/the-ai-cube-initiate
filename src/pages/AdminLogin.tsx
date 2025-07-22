import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MythCard } from '@/components/myth/MythCard';
import HomeButton from '../components/ui/HomeButton';
import { supabase } from '../lib/supabaseClient';

// Admin credentials - FOR DEVELOPMENT ONLY
const ADMIN_CREDENTIALS = {
  email: 'admin@aicube.dev',
  password: 'AdminCube2024!'
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Check admin credentials
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      setError('Invalid admin credentials');
      setIsLoading(false);
      return;
    }

    try {
      // Set admin session in localStorage
      localStorage.setItem('adminSession', JSON.stringify({
        email: ADMIN_CREDENTIALS.email,
        timestamp: Date.now(),
        isAdmin: true
      }));

      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-myth-background">
      <HomeButton />
      
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 mb-2">
            ADMIN ACCESS
          </h1>
          <p className="text-myth-textSecondary text-sm">
            Authorized personnel only
          </p>
        </div>

        <MythCard title="Administrator Login">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-myth-textSecondary mb-2">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-myth-surface border border-myth-accent/30 rounded-md text-myth-textPrimary focus:outline-none focus:border-myth-accent"
                placeholder="admin@aicube.dev"
                autoComplete="username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-myth-textSecondary mb-2">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-myth-surface border border-myth-accent/30 rounded-md text-myth-textPrimary focus:outline-none focus:border-myth-accent"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-md">
            <p className="text-yellow-500 text-xs">
              <strong>Development Mode</strong><br />
              Email: admin@aicube.dev<br />
              Password: AdminCube2024!
            </p>
          </div>
        </MythCard>
      </div>
    </div>
  );
}