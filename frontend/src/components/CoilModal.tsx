import { useState, useEffect } from 'react';
import { Coil, CoilStatus } from '../services/api';

interface CoilModalProps {
  coil: Coil | null;
  onSave: (data: Partial<Coil>) => void;
  onClose: () => void;
}

const CoilModal = ({ coil, onSave, onClose }: CoilModalProps) => {
  const [formData, setFormData] = useState({
    coilId: '',
    location: '',
    width: 0,
    weight: 0,
    orderNumber: '',
    status: CoilStatus.NP,
  });

  useEffect(() => {
    if (coil) {
      setFormData({
        coilId: coil.coilId,
        location: coil.isReadyFromCurrentLocation ? `${coil.location}*` : coil.location,
        width: coil.width,
        weight: coil.weight,
        orderNumber: coil.orderNumber || '',
        status: coil.status,
      });
    }
  }, [coil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'width' || name === 'weight' ? parseFloat(value) : value,
    }));
  };

  const getStatusColor = (status: CoilStatus) => {
    switch (status) {
      case CoilStatus.NP:
        return '#fbbf24';
      case CoilStatus.RTS:
        return '#10b981';
      case CoilStatus.SCRAP:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{coil ? 'Edit Coil' : 'Add New Coil'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Coil ID *</label>
            <input
              type="text"
              name="coilId"
              value={formData.coilId}
              onChange={handleChange}
              required
              placeholder="e.g., COIL-001"
            />
          </div>

          <div className="form-group">
            <label>Location * (add * for ready from current location)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., S1, S2, S3, 30302, or 30302*"
            />
            <small style={{ color: '#718096', fontSize: '0.875rem' }}>
              Use * to mark as ready from current location (e.g., 30302*)
            </small>
          </div>

          <div className="form-group">
            <label>Width *</label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="e.g., 1500"
            />
          </div>

          <div className="form-group">
            <label>Weight *</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="e.g., 5000"
            />
          </div>

          <div className="form-group">
            <label>Order Number (optional)</label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              placeholder="e.g., ORD-12345"
            />
            <small style={{ color: '#718096', fontSize: '0.875rem' }}>
              ✅ Load will be auto-created if order number is new
            </small>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value={CoilStatus.NP}>NP (Not Processed)</option>
              <option value={CoilStatus.RTS}>RTS (Ready To Ship)</option>
              <option value={CoilStatus.SCRAP}>Scrap</option>
            </select>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: getStatusColor(formData.status as CoilStatus),
                }}
              />
              <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>
                {formData.status === CoilStatus.NP && 'Yellow - Not Processed'}
                {formData.status === CoilStatus.RTS && 'Green - Ready To Ship'}
                {formData.status === CoilStatus.SCRAP && 'Red - Scrap'}
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {coil ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoilModal;
