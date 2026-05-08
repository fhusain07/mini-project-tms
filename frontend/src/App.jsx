import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import GenerateToken from './pages/GenerateToken';
import QueueStatus from './pages/QueueStatus';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <div className="nav-brand">Smart Queue</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/generate">Get Token</Link>
          <Link to="/status">Queue Status</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/generate"          element={<GenerateToken />} />
        <Route path="/status"            element={<QueueStatus />} />
        <Route path="/admin"             element={<AdminLogin />} />
        <Route path="/admin/dashboard"   element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
