import React, { useEffect, useState } from 'react';
import { getCoils, createCoil, updateCoil, deleteCoil, Coil } from '../services/api';
import CoilModal from '../components/CoilModal';

const Coils: React.FC = () => {
  const [coils, setCoils] = useState<Coil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCoil, setEditingCoil] = useState<Coil | null>(null);

  useEffect(() => {
    fetchCoils();
  }, []);

  const fetchCoils = async () => {
    try {
      const response = await getCoils();
      setCoils(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load coils');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCoil(null);
    setShowModal(true);
  };

  const handleEdit = (coil: Coil) => {
    setEditingCoil(coil);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coil?')) return;

    try {
      await deleteCoil(id);
      fetchCoils();
    } catch (err) {
      alert('Failed to delete coil');
      console.error(err);
    }
  };

  const handleSave = async (data: Partial<Coil>) => {
    try {
      if (editingCoil) {
        await updateCoil(editingCoil.id, data);
      } else {
        await createCoil(data);
      }
      setShowModal(false);
      fetchCoils();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save coil');
      console.error(err);
    }
  };

  const displayLocation = (coil: Coil) => {
    return coil.isReadyFromCurrentLocation ? `${coil.location}*` : coil.location;
  };

  if (loading) return <div className="loading">Loading coils...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Coils</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Coil
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Coil ID</th>
              <th>Location</th>
              <th>Width</th>
              <th>Weight</th>
              <th>Order Number</th>
              <th>Status</th>
              <th>Load ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coils.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                  No coils found. Add your first coil!
                </td>
              </tr>
            ) : (
              coils.map((coil) => (
                <tr key={coil.id}>
                  <td>
                    <strong>{coil.coilId}</strong>
                  </td>
                  <td>
                    <span className="location-display">{displayLocation(coil)}</span>
                  </td>
                  <td>{coil.width}</td>
                  <td>{coil.weight}</td>
                  <td>{coil.orderNumber || '-'}</td>
                  <td>{coil.status}</td>
                  <td>{coil.load?.loadId || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-secondary" onClick={() => handleEdit(coil)} style={{ padding: '0.5rem 1rem' }}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(coil.id)} style={{ padding: '0.5rem 1rem' }}>
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

      {showModal && (
        <CoilModal
          coil={editingCoil}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Coils;
