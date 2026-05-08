import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllTokens,
  callNextToken,
  completeToken,
  resetQueue,
  getStats,
  getCurrentToken
} from '../services/api';

function AdminDashboard() {
  const [tokens, setTokens]           = useState([]);
  const [stats, setStats]             = useState({ waiting: 0, active: 0, completed: 0 });
  const [currentToken, setCurrentToken] = useState(null);
  const [message, setMessage]         = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [tokensRes, statsRes, currentRes] = await Promise.all([
        getAllTokens(),
        getStats(),
        getCurrentToken()
      ]);
      setTokens(tokensRes.data);
      setStats(statsRes.data);
      setCurrentToken(currentRes.data);
    } catch {
      // silently retry on next cycle
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleNext = async () => {
    try {
      const res = await callNextToken();
      showMessage(res.data.message || `Now serving token #${res.data.tokenNumber}`);
      fetchData();
    } catch {
      showMessage('Error calling next token');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeToken(id);
      fetchData();
    } catch {
      showMessage('Error completing token');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset the entire queue? This will delete all tokens.')) return;
    try {
      await resetQueue();
      showMessage('Queue has been reset successfully');
      fetchData();
    } catch {
      showMessage('Error resetting queue');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const getBadgeClass = (status) => {
    if (status === 'Waiting')   return 'badge badge-waiting';
    if (status === 'Active')    return 'badge badge-active';
    return 'badge badge-completed';
  };

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Admin Dashboard</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>

      {/* Alert */}
      {message && <div className="message message-success">{message}</div>}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.waiting}</div>
          <div className="stat-label">Waiting</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#10b981' }}>{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#6b7280' }}>{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontWeight: '600', marginRight: '0.75rem' }}>Now Serving:</span>
            {currentToken ? (
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1d4ed8' }}>
                #{currentToken.tokenNumber} — {currentToken.customerName}
              </span>
            ) : (
              <span style={{ color: '#9ca3af' }}>No active token</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={handleNext}>
              Call Next Token
            </button>
            <button className="btn btn-danger" onClick={handleReset}>
              Reset Queue
            </button>
          </div>
        </div>
      </div>

      {/* Token Table */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>All Tokens</h3>
        {tokens.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>
            No tokens in queue. Users can generate tokens from the main page.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Token #</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id}>
                  <td><strong>#{token.tokenNumber}</strong></td>
                  <td>{token.customerName}</td>
                  <td>
                    <span className={getBadgeClass(token.status)}>{token.status}</span>
                  </td>
                  <td style={{ color: '#6b7280', fontSize: '0.88rem' }}>
                    {new Date(token.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {token.status !== 'Completed' && (
                      <button
                        className="btn btn-success"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                        onClick={() => handleComplete(token.id)}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
