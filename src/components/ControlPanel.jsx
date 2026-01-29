import React, { useState } from "react";

const SPEED = 0.1; // HARUS SAMA DENGAN RadarCanvas

function ControlPanel({ points, setPoints }) {
  const [count, setCount] = useState(20);

  const generatePoints = () => {
    const newPoints = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Menambahkan Altitude (FL) acak saat generate
      const randomAlt = Math.floor(Math.random() * 300) + 100;

      newPoints.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        vx: Math.cos(angle) * SPEED,
        vy: Math.sin(angle) * SPEED,
        alt: randomAlt
      });
    }

    setPoints(newPoints);
  };

  return (
    <div className="card bg-dark text-light border-success shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
      <div className="card-header border-success bg-transparent py-3">
        <h5 className="text-success mb-0 fw-bold" style={{ letterSpacing: '2px' }}>
          <i className="bi bi-radar me-2"></i> SYSTEM CONTROL
        </h5>
      </div>

      <div className="card-body">
        <div className="mb-4">
          <label className="form-label text-secondary small fw-bold">JUMLAH ARMADA (ACFT)</label>
          <div className="input-group">
            <span className="input-group-text bg-transparent text-success border-secondary">
              <small>QTY</small>
            </span>
            <input
              type="number"
              className="form-control bg-dark text-success border-secondary shadow-none"
              value={count}
              min="2"
              onChange={(e) => setCount(Number(e.target.value))}
              style={{ fontWeight: 'bold' }}
            />
          </div>
        </div>

        <button 
          className="btn btn-outline-success w-100 py-2 fw-bold mb-3 transition-all" 
          onClick={generatePoints}
          style={{ borderWidth: '2px', textTransform: 'uppercase' }}
        >
          Generate Radar Points
        </button>

        <div className="p-3 rounded bg-black border border-secondary shadow-inner">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-secondary small">Status:</span>
            <span className="badge bg-success text-dark">ACTIVE</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small">Total Titik:</span>
            <span className="text-success fw-mono"><b>{points.length}</b></span>
          </div>
        </div>
      </div>
      
      <div className="card-footer bg-transparent border-top-0 pb-3">
        <small className="text-muted italic" style={{ fontSize: '0.7rem' }}>
          *Air Traffic Simulation V.1.0 - 2026
        </small>
      </div>
    </div>
  );
}

export default ControlPanel;