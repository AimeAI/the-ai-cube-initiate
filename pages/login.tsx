// pages/login.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { loginUser, registerUser, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await loginUser(email, password);
  };

  const handleRegister = async () => {
    await registerUser(email, password);
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login / Register</h2>
      <input
        className="border p-2 w-full mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-4">
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
        <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">
          Register
        </button>
      </div>
      {loading && <p className="mt-4 text-sm text-gray-500">Loading...</p>}
    </div>
  );
}