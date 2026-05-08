import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="card hero">
        <h1>Smart Queue Management System</h1>
        <p>
          Manage your queue digitally. Enter your name, get a token,
          and track your position in real-time — no physical waiting in line.
        </p>
        <div className="hero-actions">
          <Link to="/generate">
            <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.05rem' }}>
              Get Token
            </button>
          </Link>
          <Link to="/status">
            <button className="btn btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1.05rem' }}>
              View Queue Status
            </button>
          </Link>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🎫</div>
          <h3>Get a Token</h3>
          <p>Enter your name and instantly receive a unique queue token number.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Live Status</h3>
          <p>See which token is being served and how many are ahead of you.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast & Simple</h3>
          <p>No registration needed. Works instantly from any browser.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
