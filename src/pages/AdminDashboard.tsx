import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MythCard } from '@/components/myth/MythCard';
import { MythButton } from '@/components/myth/MythButton';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminSession, setAdminSession] = useState<any>(null);

  useEffect(() => {
    // Check admin session
    const session = localStorage.getItem('adminSession');
    if (!session) {
      navigate('/admin/login');
      return;
    }

    const sessionData = JSON.parse(session);
    // Check if session is expired (24 hours)
    if (Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('adminSession');
      navigate('/admin/login');
      return;
    }

    setAdminSession(sessionData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin/login');
  };

  if (!adminSession) {
    return null;
  }

  const quickLinks = [
    { path: '/', label: 'Home Page', description: 'View landing page' },
    { path: '/dashboard/parent', label: 'Parent Portal', description: 'Access parent dashboard' },
    { path: '/dashboard/student', label: 'Student Dashboard', description: 'View student interface' },
    { path: '/payment', label: 'Payment Page', description: 'Review subscription flow' },
    { path: '/games', label: 'Games Hub', description: 'Browse all learning simulations' },
  ];

  const games = [
    { path: '/games/neural-network-chamber', label: 'Neural Network Chamber' },
    { path: '/games/quantum-chamber', label: 'Quantum Chamber' },
    { path: '/games/crystal-resonance', label: 'Crystal Resonance' },
    { path: '/games/decision-tree', label: 'Decision Tree' },
    { path: '/games/predictor-engine', label: 'Predictor Engine' },
    { path: '/games/reinforcement-lab', label: 'Reinforcement Lab' },
    { path: '/games/vision-system', label: 'Vision System' },
    { path: '/games/snake-3', label: 'Snake 3' },
  ];

  return (
    <div className="min-h-screen bg-myth-background text-myth-textPrimary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">
              Admin Dashboard
            </h1>
            <p className="text-myth-textSecondary mt-2">
              Site Review Mode - {adminSession.email}
            </p>
          </div>
          <MythButton
            label="Logout"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MythCard title="Quick Navigation">
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block p-3 bg-myth-surface hover:bg-myth-accent/10 rounded-md transition-colors"
                >
                  <div className="font-semibold text-myth-accent">{link.label}</div>
                  <div className="text-sm text-myth-textSecondary">{link.description}</div>
                </Link>
              ))}
            </div>
          </MythCard>

          <MythCard title="Game Simulations">
            <div className="grid grid-cols-1 gap-2">
              {games.map((game) => (
                <Link
                  key={game.path}
                  to={game.path}
                  className="block p-2 bg-myth-surface hover:bg-myth-accent/10 rounded-md transition-colors text-sm"
                >
                  {game.label}
                </Link>
              ))}
            </div>
          </MythCard>
        </div>

        <MythCard title="Admin Tools">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-myth-surface rounded-md">
              <h3 className="font-semibold text-myth-accent mb-2">Development Mode</h3>
              <p className="text-sm text-myth-textSecondary">
                You're in admin review mode. All features are accessible without authentication.
              </p>
            </div>
            <div className="p-4 bg-myth-surface rounded-md">
              <h3 className="font-semibold text-myth-accent mb-2">Test Credentials</h3>
              <p className="text-sm text-myth-textSecondary">
                Use these credentials to test regular user flows if needed.
              </p>
              <div className="mt-2 text-xs">
                <p>Parent: demo@aicube.ai</p>
                <p>Password: Demo123!</p>
              </div>
            </div>
            <div className="p-4 bg-myth-surface rounded-md">
              <h3 className="font-semibold text-myth-accent mb-2">Session Info</h3>
              <p className="text-sm text-myth-textSecondary">
                Session expires in 24 hours
              </p>
              <p className="text-xs text-yellow-500 mt-2">
                Admin mode active
              </p>
            </div>
          </div>
        </MythCard>

        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-md">
          <p className="text-yellow-500 text-sm">
            <strong>⚠️ Development Notice:</strong> This admin panel is for development review only. 
            In production, implement proper authentication and role-based access control.
          </p>
        </div>
      </div>
    </div>
  );
}