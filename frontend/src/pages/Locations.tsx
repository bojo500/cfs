import React, { useEffect, useState } from 'react';
import { getLocations, updateLocationCapacity, Location } from '../services/api';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [newCapacity, setNewCapacity] = useState<number>(0);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCapacity = (location: Location) => {
    setEditingLocation(location.locationCode);
    setNewCapacity(location.capacity);
  };

  const handleSaveCapacity = async (locationCode: string) => {
    try {
      await updateLocationCapacity(locationCode, newCapacity);
      setEditingLocation(null);
      fetchLocations();
    } catch (err) {
      alert('Failed to update capacity');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingLocation(null);
    setNewCapacity(0);
  };

  if (loading) return <div className="loading">Loading locations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1 className="page-title">Locations</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Location Code</th>
              <th>Capacity</th>
              <th>Occupied</th>
              <th>Free Space</th>
              <th>Utilization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                  No locations found. Locations are created automatically when coils are added.
                </td>
              </tr>
            ) : (
              locations.map((location) => {
                const utilization = ((location.occupied / location.capacity) * 100).toFixed(1);
                const isEditing = editingLocation === location.locationCode;

                return (
                  <tr key={location.id}>
                    <td>
                      <strong style={{ fontSize: '1.1rem' }}>{location.locationCode}</strong>
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={newCapacity}
                          onChange={(e) => setNewCapacity(parseInt(e.target.value))}
                          style={{
                            width: '80px',
                            padding: '0.5rem',
                            border: '2px solid #667eea',
                            borderRadius: '4px',
                          }}
                          autoFocus
                        />
                      ) : (
                        location.capacity
                      )}
                    </td>
                    <td>{location.occupied}</td>
                    <td>
                      <span
                        style={{
                          color: location.freeSpace > 5 ? '#48bb78' : '#e53e3e',
                          fontWeight: '600',
                        }}
                      >
                        {location.freeSpace}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '100px',
                            height: '8px',
                            background: '#e2e8f0',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${utilization}%`,
                              height: '100%',
                              background:
                                parseFloat(utilization) > 90
                                  ? '#e53e3e'
                                  : parseFloat(utilization) > 70
                                  ? '#ed8936'
                                  : '#48bb78',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                          {utilization}%
                        </span>
                      </div>
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="action-buttons">
                          <button
                            className="btn btn-success"
                            onClick={() => handleSaveCapacity(location.locationCode)}
                            style={{ padding: '0.5rem 1rem' }}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            style={{ padding: '0.5rem 1rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEditCapacity(location)}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          Edit Capacity
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Legend</h3>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '8px', background: '#48bb78', borderRadius: '4px' }} />
            <span>0-70% (Good)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '8px', background: '#ed8936', borderRadius: '4px' }} />
            <span>70-90% (Warning)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '8px', background: '#e53e3e', borderRadius: '4px' }} />
            <span>90-100% (Critical)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
