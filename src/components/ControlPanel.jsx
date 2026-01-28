import React, { useState } from "react";

function ControlPanel({ points, setPoints }) {
  const [count, setCount] = useState(20);

  const generatePoints = () => {
    const newPoints = [];
    for (let i = 0; i < count; i++) {
      newPoints.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
      });
    }
    setPoints(newPoints);
  };

  return (
    <div>
      <h5 className="text-success mb-3">Control Panel</h5>

      <label className="form-label">Jumlah Pesawat</label>
      <input
        type="number"
        className="form-control mb-3"
        value={count}
        min="2"
        onChange={(e) => setCount(Number(e.target.value))}
      />

      <button className="btn btn-success w-100" onClick={generatePoints}>
        Generate Radar Points
      </button>

      <hr className="border-secondary" />

      <p className="text-secondary">
        Total titik: <b>{points.length}</b>
      </p>
    </div>
  );
}

export default ControlPanel;
