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
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState({
    waiting: 0,
    active: 0,
    completed: 0
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const [currentToken, setCurrentToken] = useState(null);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Voice Announcement Function
  const speakToken = (tokenNumber, customerName) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const announcement = customerName
        ? `Token Number ${tokenNumber} with customer name ${customerName}`
        : `Token Number ${tokenNumber}`;

      const speech = new SpeechSynthesisUtterance(
        announcement
      );

      speech.lang = 'en-US';
      speech.rate = 1;
      speech.pitch = 1;
      speech.volume = 1;

      // Optional better voice selection
      const voices = window.speechSynthesis.getVoices();

      const preferredVoice =
        voices.find((voice) =>
          voice.name.toLowerCase().includes('google')
        ) || voices[0];

      if (preferredVoice) {
        speech.voice = preferredVoice;
      }

      window.speechSynthesis.speak(speech);
    }
  };

  const fetchData = async (activeFilters = filters) => {
    try {
      const tokenFilters = {};

      if (activeFilters.startDate) {
        tokenFilters.startDate = activeFilters.startDate;
      }

      if (activeFilters.endDate) {
        tokenFilters.endDate = activeFilters.endDate;
      }

      const [tokensRes, statsRes, currentRes] = await Promise.all([
        getAllTokens(tokenFilters),
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

    fetchData(filters);
  }, [navigate, filters]);

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleNext = async () => {
    try {
      const res = await callNextToken();

      const tokenNumber = res.data.tokenNumber;
      const customerName = res.data.customerName;

      showMessage(
        res.data.message ||
          `Now serving token #${tokenNumber}${customerName ? ` - ${customerName}` : ''}`
      );

      // Voice Announcement
      if (tokenNumber) {
        speakToken(tokenNumber, customerName);
      }

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
    if (
      !window.confirm(
        'Reset the entire queue? This will delete all tokens.'
      )
    )
      return;

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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: ''
    });
  };

  const getBadgeClass = (status) => {
    if (status === 'Waiting') return 'badge badge-waiting';
    if (status === 'Active') return 'badge badge-active';

    return 'badge badge-completed';
  };

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <h2>Admin Dashboard</h2>

        <button
          className="btn btn-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Alert */}
      {message && (
        <div className="message message-success">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-number"
            style={{ color: '#f59e0b' }}
          >
            {stats.waiting}
          </div>

          <div className="stat-label">Waiting</div>
        </div>

        <div className="stat-card">
          <div
            className="stat-number"
            style={{ color: '#10b981' }}
          >
            {stats.active}
          </div>

          <div className="stat-label">Active</div>
        </div>

        <div className="stat-card">
          <div
            className="stat-number"
            style={{ color: '#6b7280' }}
          >
            {stats.completed}
          </div>

          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span
              style={{
                fontWeight: '600',
                marginRight: '0.75rem'
              }}
            >
              Now Serving:
            </span>

            {currentToken ? (
              <span
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#1d4ed8'
                }}
              >
                #{currentToken.tokenNumber} —{' '}
                {currentToken.customerName}
              </span>
            ) : (
              <span style={{ color: '#9ca3af' }}>
                No active token
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Call Next Token
            </button>

            <button
              className="btn btn-danger"
              onClick={handleReset}
            >
              Reset Queue
            </button>
          </div>
        </div>
      </div>

      {/* Token Table */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}
        >
          <div>
            <h3 style={{ marginBottom: '0.35rem' }}>
              All Tokens
            </h3>

            <p
              style={{
                color: '#6b7280',
                fontSize: '0.9rem',
                margin: 0
              }}
            >
              Filter records by creation date.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              alignItems: 'flex-end'
            }}
          >
            <div style={{ minWidth: '160px' }}>
              <label htmlFor="startDate">
                From Date
              </label>

              <input
                id="startDate"
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div style={{ minWidth: '160px' }}>
              <label htmlFor="endDate">
                To Date
              </label>

              <input
                id="endDate"
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={clearFilters}
              disabled={
                !filters.startDate && !filters.endDate
              }
            >
              Clear Filter
            </button>
          </div>
        </div>

        {tokens.length === 0 ? (
          <p
            style={{
              color: '#9ca3af',
              textAlign: 'center',
              padding: '2rem 0'
            }}
          >
            {filters.startDate || filters.endDate
              ? 'No token records found for the selected date range.'
              : 'No tokens in queue. Users can generate tokens from the main page.'}
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
                  <td>
                    <strong>
                      #{token.tokenNumber}
                    </strong>
                  </td>

                  <td>{token.customerName}</td>

                  <td>
                    <span
                      className={getBadgeClass(
                        token.status
                      )}
                    >
                      {token.status}
                    </span>
                  </td>

                  <td
                    style={{
                      color: '#6b7280',
                      fontSize: '0.88rem'
                    }}
                  >
                    {new Date(
                      token.createdAt
                    ).toLocaleString()}
                  </td>

                  <td>
                    {token.status !==
                      'Completed' && (
                      <button
                        className="btn btn-success"
                        style={{
                          padding: '0.3rem 0.8rem',
                          fontSize: '0.85rem'
                        }}
                        onClick={() =>
                          handleComplete(token.id)
                        }
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