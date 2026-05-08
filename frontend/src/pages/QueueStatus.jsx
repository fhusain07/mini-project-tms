import { useState, useEffect } from 'react';
import { getCurrentToken, getStats } from '../services/api';

function QueueStatus() {
  const [currentToken, setCurrentToken] = useState(null);
  const [stats, setStats]               = useState({ waiting: 0, active: 0, completed: 0 });
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  const fetchData = async () => {
    try {
      const [currentRes, statsRes] = await Promise.all([
        getCurrentToken(),
        getStats()
      ]);
      setCurrentToken(currentRes.data);
      setStats(statsRes.data);
      setError('');
    } catch {
      setError('Could not fetch queue data. Make sure the backend is running.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <p style={{ color: '#6b7280' }}>Loading queue status...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1.5rem' }}>Live Queue Status</h2>

      {error && <div className="message message-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.waiting}</div>
          <div className="stat-label">Waiting</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#10b981' }}>{stats.active}</div>
          <div className="stat-label">Now Serving</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#6b7280' }}>{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div className="token-label">Now Serving Token</div>
        {currentToken ? (
          <>
            <div className="token-number">{currentToken.tokenNumber}</div>
            <p style={{ marginTop: '0.75rem', color: '#374151', fontSize: '1.1rem' }}>
              {currentToken.customerName}
            </p>
            <p style={{ marginTop: '0.4rem' }}>
              <span className="badge badge-active">Active</span>
            </p>
          </>
        ) : (
          <div style={{ padding: '1rem 0', color: '#9ca3af', fontSize: '1.1rem' }}>
            No token is being served right now
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', marginTop: '-0.5rem' }}>
        Auto-refreshes every 5 seconds
      </p>
    </div>
  );
}

export default QueueStatus;
