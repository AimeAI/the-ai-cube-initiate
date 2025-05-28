import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TrajectoryGame: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'navigateDashboard') {
        navigate('/dashboard');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="/games/trajectory-game/index.html"
        title="Trajectory Game"
        style={{ border: 'none', width: '100%', height: '100%' }}
        allowFullScreen
      />
    </div>
  );
};

export default TrajectoryGame;