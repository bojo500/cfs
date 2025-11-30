import { useEffect, useState } from 'react';
import { getLocationMap, LocationMap as LocationMapType, LocationMapCell } from '../services/api';

const LocationMap = () => {
  const [mapData, setMapData] = useState<LocationMapType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<LocationMapCell | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchLocationMap();
    const interval = setInterval(fetchLocationMap, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLocationMap = async () => {
    try {
      const response = await getLocationMap();
      setMapData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load location map');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCellHover = (cell: LocationMapCell, event: React.MouseEvent) => {
    if (cell.coilCount > 0) {
      setHoveredCell(cell);
      setTooltipPosition({ x: event.clientX + 10, y: event.clientY + 10 });
    }
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NP':
        return '#fbbf24'; // Yellow
      case 'RTS':
        return '#10b981'; // Green
      case 'scrap':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  if (loading) return <div className="loading">Loading location map...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!mapData) return null;

  return (
    <div>
      <h1 className="page-title">Location Map</h1>

      <div style={{ marginBottom: '2rem' }}>
        {/* Legend */}
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Status Legend</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: '#fbbf24', borderRadius: '4px' }} />
              <span>NP (Not Processed)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '4px' }} />
              <span>RTS (Ready To Ship)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', background: '#ef4444', borderRadius: '4px' }} />
              <span>Scrap</span>
            </div>
          </div>
        </div>


        {/* Main Grid - Section 3 (6 rows × 4 columns) */}
        <div className="location-map-container" style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>Section 3 - Main Grid</h3>

          {/* Grid Rows (North to South) */}
          <div className="location-map-grid">
          {mapData.cells.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
              {/* Grid Cells */}
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`location-map-cell ${cell.coilCount > 0 ? 'location-cell-hover' : ''}`}
                  onMouseEnter={(e) => handleCellHover(cell, e)}
                  onMouseMove={(e) => setTooltipPosition({ x: e.clientX + 10, y: e.clientY + 10 })}
                  onMouseLeave={handleCellLeave}
                  style={{
                    background: cell.coilCount > 0 ? '#f3f4f6' : '#ffffff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '1rem',
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: cell.coilCount > 0 ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    position: 'relative',
                    boxShadow: cell.coilCount > 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#4b5563',
                    marginBottom: '0.5rem',
                  }}>
                    {cell.locationCode}
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: cell.coilCount > 0 ? '#1f2937' : '#9ca3af',
                  }}>
                    {cell.coilCount}
                  </div>
                </div>
              ))}
            </div>
          ))}
          </div>
        </div>

        {/* Special Rows Below Main Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Row 126 */}
          <div
            className="location-map-special-area"
            onMouseEnter={(e) => handleCellHover(mapData.specialAreas.row126, e)}
            onMouseMove={(e) => setTooltipPosition({ x: e.clientX + 10, y: e.clientY + 10 })}
            onMouseLeave={handleCellLeave}
            style={{
              background: mapData.specialAreas.row126.coilCount > 0 ? '#fef3c7' : '#fffbeb',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #f59e0b',
              cursor: mapData.specialAreas.row126.coilCount > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#92400e', fontWeight: '700', fontSize: '1.125rem' }}>Row 126</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#92400e' }}>
                {mapData.specialAreas.row126.coilCount}
              </div>
            </div>
          </div>

          {/* S3 */}
          <div
            className="location-map-special-area"
            onMouseEnter={(e) => handleCellHover(mapData.specialAreas.s3, e)}
            onMouseMove={(e) => setTooltipPosition({ x: e.clientX + 10, y: e.clientY + 10 })}
            onMouseLeave={handleCellLeave}
            style={{
              background: mapData.specialAreas.s3.coilCount > 0 ? '#dbeafe' : '#eff6ff',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #3b82f6',
              cursor: mapData.specialAreas.s3.coilCount > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#1e40af', fontWeight: '700', fontSize: '1.125rem' }}>S3</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af' }}>
                {mapData.specialAreas.s3.coilCount}
              </div>
            </div>
          </div>

          {/* Truck Reserving Area */}
          <div
            className="location-map-special-area"
            onMouseEnter={(e) => handleCellHover(mapData.specialAreas.truckReserving, e)}
            onMouseMove={(e) => setTooltipPosition({ x: e.clientX + 10, y: e.clientY + 10 })}
            onMouseLeave={handleCellLeave}
            style={{
              background: mapData.specialAreas.truckReserving.coilCount > 0 ? '#e9d5ff' : '#faf5ff',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #a855f7',
              cursor: mapData.specialAreas.truckReserving.coilCount > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#6b21a8', fontWeight: '700', fontSize: '1.125rem' }}>Truck Reserving Area</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6b21a8' }}>
                {mapData.specialAreas.truckReserving.coilCount}
              </div>
            </div>
          </div>

          {/* S3OS */}
          <div
            className="location-map-special-area"
            onMouseEnter={(e) => handleCellHover(mapData.specialAreas.s3os, e)}
            onMouseMove={(e) => setTooltipPosition({ x: e.clientX + 10, y: e.clientY + 10 })}
            onMouseLeave={handleCellLeave}
            style={{
              background: mapData.specialAreas.s3os.coilCount > 0 ? '#fee2e2' : '#fef2f2',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #ef4444',
              cursor: mapData.specialAreas.s3os.coilCount > 0 ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#991b1b', fontWeight: '700', fontSize: '1.125rem' }}>S3OS</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#991b1b' }}>
                {mapData.specialAreas.s3os.coilCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && hoveredCell.coilCount > 0 && (
        <div style={{
          position: 'fixed',
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: '200px',
          maxWidth: '300px',
          pointerEvents: 'none',
        }}>
          <div style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#1f2937' }}>
            {hoveredCell.locationCode} - {hoveredCell.coilCount} coil(s)
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {hoveredCell.coils.map((coil, idx) => (
              <div key={idx} style={{
                padding: '0.5rem',
                background: '#f9fafb',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.813rem',
              }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>{coil.coilId}</span>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: getStatusColor(coil.status),
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}>
                  {coil.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .location-cell-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border-color: #667eea !important;
        }
      `}</style>
    </div>
  );
};

export default LocationMap;
