import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Coils from './pages/Coils';
import Loads from './pages/Loads';
import Locations from './pages/Locations';
import LocationMap from './pages/LocationMap';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>CoilFlow</h1>
          <p>Manufacturing Management System</p>
        </header>

        <nav className="nav">
          <ul className="nav-list">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/coils">Coils</Link>
            </li>
            <li>
              <Link to="/loads">Loads</Link>
            </li>
            <li>
              <Link to="/location-map">Location Map</Link>
            </li>
            <li>
              <Link to="/locations">Locations</Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/coils" element={<Coils />} />
            <Route path="/loads" element={<Loads />} />
            <Route path="/location-map" element={<LocationMap />} />
            <Route path="/locations" element={<Locations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
