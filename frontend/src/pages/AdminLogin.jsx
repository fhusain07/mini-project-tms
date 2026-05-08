import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await adminLogin(username, password);
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid username or password. Try admin / admin123');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: '420px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Admin Login</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Sign in to manage the queue
        </p>

        {error && <div className="message message-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            autoFocus
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.82rem', marginTop: '1.5rem' }}>
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
