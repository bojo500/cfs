import { useEffect, useState } from 'react';
import { getStats, getTodayLoads, getTomorrowLoads, Stats, Load } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayLoads, setTodayLoads] = useState<Load[]>([]);
  const [tomorrowLoads, setTomorrowLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, todayRes, tomorrowRes] = await Promise.all([
        getStats(),
        getTodayLoads(),
        getTomorrowLoads(),
      ]);

      setStats(statsRes.data);
      setTodayLoads(todayRes.data);
      setTomorrowLoads(tomorrowRes.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return '#48bb78';
      case 'Missing':
        return '#ed8936';
      case 'Shipped':
        return '#718096';
      default:
        return '#9ca3af';
    }
  };

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Coils</h3>
          <div className="value">{stats.totalCoils}</div>
        </div>

        <div className="stat-card">
          <h3>Total Loads</h3>
          <div className="value">{stats.totalLoads}</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#48bb78' }}>
          <h3>Ready Loads</h3>
          <div className="value" style={{ color: '#48bb78' }}>
            {stats.readyLoads}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#ed8936' }}>
          <h3>Missing Loads</h3>
          <div className="value" style={{ color: '#ed8936' }}>
            {stats.missingLoads}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#718096' }}>
          <h3>Shipped Loads</h3>
          <div className="value" style={{ color: '#718096' }}>
            {stats.shippedLoads}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#48bb78' }}>
          <h3>Ready Coils</h3>
          <div className="value" style={{ color: '#48bb78' }}>
            {stats.readyCoils}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#ed8936' }}>
          <h3>Missing Coils</h3>
          <div className="value" style={{ color: '#ed8936' }}>
            {stats.missingCoils}
          </div>
        </div>
      </div>

      {/* Today's and Tomorrow's Loads */}
      <div className="loads-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {/* Today's Loads */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>
            📅 Today's Loads ({todayLoads.length})
          </h2>
          {todayLoads.length === 0 ? (
            <p style={{ color: '#718096', fontStyle: 'italic' }}>No loads scheduled for today</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todayLoads.map(load => (
                <div
                  key={load.id}
                  style={{
                    padding: '1rem',
                    background: '#f7fafc',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${getStatusColor(load.status)}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#2d3748' }}>{load.loadId}</div>
                      <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                        Order: {load.orderNumber}
                        {load.clientName && ` | ${load.clientName}`}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        background: getStatusColor(load.status),
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {load.status}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#4a5568', marginTop: '0.5rem' }}>
                    {load.coils.length} coil(s)
                    {load.timeToShip && ` | Ship: ${new Date(load.timeToShip).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tomorrow's Loads */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>
            📅 Tomorrow's Loads ({tomorrowLoads.length})
          </h2>
          {tomorrowLoads.length === 0 ? (
            <p style={{ color: '#718096', fontStyle: 'italic' }}>No loads scheduled for tomorrow</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tomorrowLoads.map(load => (
                <div
                  key={load.id}
                  style={{
                    padding: '1rem',
                    background: '#f7fafc',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${getStatusColor(load.status)}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#2d3748' }}>{load.loadId}</div>
                      <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                        Order: {load.orderNumber}
                        {load.clientName && ` | ${load.clientName}`}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        background: getStatusColor(load.status),
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {load.status}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#4a5568', marginTop: '0.5rem' }}>
                    {load.coils.length} coil(s)
                    {load.timeToShip && ` | Ship: ${new Date(load.timeToShip).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
