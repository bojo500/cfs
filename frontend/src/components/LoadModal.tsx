import React, { useState, useEffect } from 'react';
import { Load } from '../services/api';

interface LoadModalProps {
  load: Load;
  onSave: (data: Partial<Load>) => void;
  onClose: () => void;
}

const LoadModal: React.FC<LoadModalProps> = ({ load, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    loadId: '',
    orderNumber: '',
    scheduledShippingDate: '',
    clientName: '',
  });

  useEffect(() => {
    // Convert existing timeToShip or shipDate to datetime-local format (YYYY-MM-DDTHH:mm)
    let scheduledDateTime = '';
    if (load.shipDate) {
      // If shipDate exists (YYYY-MM-DD), use it with default time
      scheduledDateTime = `${load.shipDate}T08:00`;
    } else if (load.timeToShip) {
      // Try to parse timeToShip as a date
      const date = new Date(load.timeToShip);
      if (!isNaN(date.getTime())) {
        scheduledDateTime = date.toISOString().slice(0, 16);
      }
    }

    setFormData({
      loadId: load.loadId,
      orderNumber: load.orderNumber,
      scheduledShippingDate: scheduledDateTime,
      clientName: load.clientName || '',
    });
  }, [load]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert datetime-local format to ISO string for backend
    const dataToSave: any = {
      loadId: formData.loadId,
      orderNumber: formData.orderNumber,
      clientName: formData.clientName,
    };

    // Parse the datetime-local value and extract date and full datetime
    if (formData.scheduledShippingDate) {
      const dateTime = new Date(formData.scheduledShippingDate);
      if (!isNaN(dateTime.getTime())) {
        // Extract just the date (YYYY-MM-DD) for shipDate field
        dataToSave.shipDate = dateTime.toISOString().split('T')[0];
        // Keep full datetime for timeToShip (for display purposes)
        dataToSave.timeToShip = dateTime.toISOString();
      }
    }

    onSave(dataToSave);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Load</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Load ID</label>
            <input
              type="text"
              name="loadId"
              value={formData.loadId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Order Number</label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="e.g., ABC Steel Corp"
            />
          </div>

          <div className="form-group">
            <label>Scheduled Shipping Date & Time *</label>
            <input
              type="datetime-local"
              name="scheduledShippingDate"
              value={formData.scheduledShippingDate}
              onChange={handleChange}
              required
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                width: '100%',
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem', marginBottom: 0 }}>
              Select the exact date and time when this load should be shipped. This will determine if the load appears in "Today's Loads" or "Tomorrow's Loads".
            </p>
          </div>

          <div className="card" style={{ marginTop: '1.5rem', background: '#f7fafc' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Load Info</h4>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: '0.25rem 0' }}>
              <strong>Status:</strong> {load.status}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: '0.25rem 0' }}>
              <strong>Coils:</strong> {load.coils?.length || 0}
            </p>
            {load.coils && load.coils.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>Coil IDs:</strong>
                <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#667eea' }}>
                  {load.coils.map((c) => c.coilId).join(', ')}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoadModal;
