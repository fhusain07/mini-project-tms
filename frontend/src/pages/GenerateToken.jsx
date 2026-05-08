import { useState } from 'react';
import { generateToken } from '../services/api';

function GenerateToken() {
  const [name, setName]       = useState('');
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await generateToken(name.trim());
      setToken(res.data);
      setName('');
    } catch {
      setError('Failed to generate token. Make sure the backend is running.');
    }
    setLoading(false);
  };

  const handleNewToken = () => {
    setToken(null);
    setError('');
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Get Your Queue Token</h2>

        {!token ? (
          <form onSubmit={handleSubmit}>
            {error && <div className="message message-error">{error}</div>}

            <label>Your Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Natasha Chadekar"
              autoFocus
            />

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {loading ? 'Generating...' : 'Generate Token'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className="message message-success">
              Token generated successfully!
            </div>

            <div className="token-label" style={{ marginTop: '1.5rem' }}>Your Token Number</div>
            <div className="token-number">{token.tokenNumber}</div>

            <p style={{ marginTop: '1rem', color: '#374151' }}>
              Hello, <strong>{token.customerName}</strong>!
            </p>
            <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
              Please wait — your token will be called shortly.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Status: <span className="badge badge-waiting">{token.status}</span>
            </p>

            <button
              className="btn btn-secondary"
              style={{ marginTop: '2rem', width: '100%' }}
              onClick={handleNewToken}
            >
              Generate Another Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateToken;
