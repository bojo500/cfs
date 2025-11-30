import React, { useEffect, useState } from 'react';
import { getLoads, updateLoad, updateLoadStatus, deleteLoad, Load } from '../services/api';
import LoadModal from '../components/LoadModal';

const Loads: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async () => {
    try {
      const response = await getLoads();
      setLoads(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load loads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (load: Load) => {
    setEditingLoad(load);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this load?')) return;

    try {
      await deleteLoad(id);
      fetchLoads();
    } catch (err) {
      alert('Failed to delete load');
      console.error(err);
    }
  };

  const handleMarkShipped = async (id: number) => {
    try {
      await updateLoadStatus(id, 'Shipped');
      fetchLoads();
    } catch (err) {
      alert('Failed to update load status');
      console.error(err);
    }
  };

  const handleSave = async (data: Partial<Load>) => {
    try {
      if (editingLoad) {
        await updateLoad(editingLoad.id, data);
      }
      setShowModal(false);
      fetchLoads();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save load');
      console.error(err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'badge-ready';
      case 'Missing':
        return 'badge-missing';
      case 'Shipped':
        return 'badge-shipped';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">Loading loads...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1 className="page-title">Loads</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Load ID</th>
              <th>Order Number</th>
              <th>Client Name</th>
              <th>Scheduled Ship Date</th>
              <th>Status</th>
              <th>Coils Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loads.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                  No loads found. Loads are created automatically when adding coils with order numbers.
                </td>
              </tr>
            ) : (
              loads.map((load) => (
                <tr key={load.id} style={load.status === 'Shipped' ? { opacity: 0.6 } : {}}>
                  <td>
                    <strong>{load.loadId}</strong>
                  </td>
                  <td>{load.orderNumber}</td>
                  <td>{load.clientName || '-'}</td>
                  <td>
                    {load.shipDate ? (
                      <div>
                        <div style={{ fontWeight: '600' }}>{load.shipDate}</div>
                        {load.timeToShip && (
                          <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                            {new Date(load.timeToShip).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    ) : load.timeToShip ? (
                      new Date(load.timeToShip).toLocaleString()
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(load.status)}`}>
                      {load.status}
                    </span>
                  </td>
                  <td>{load.coils?.length || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(load)}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        Edit
                      </button>
                      {load.status !== 'Shipped' && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleMarkShipped(load.id)}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          Mark Shipped
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(load.id)}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && editingLoad && (
        <LoadModal
          load={editingLoad}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Loads;
