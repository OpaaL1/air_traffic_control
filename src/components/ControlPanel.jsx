import React, { useState, useMemo } from "react";

const SPEED = 0.1;

function ControlPanel({ points, setPoints }) {
  const [count, setCount] = useState(20);

  const trafficLevel = Math.min(100, (points.length / 50) * 100);
  const conflictCount = useMemo(
    () => points.filter(p => p.isConflict).length,
    [points]
  );

  const generatePoints = () => {
    const newPoints = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const randomAlt = Math.floor(Math.random() * 30) + 100;

      newPoints.push({
        id: `AC${Math.floor(1000 + Math.random() * 9000)}`,
        x: Math.random() * 500,
        y: Math.random() * 500,
        vx: Math.cos(angle) * SPEED,
        vy: Math.sin(angle) * SPEED,
        alt: randomAlt,
        history: [],
        isConflict: false
      });
    }

    setPoints(newPoints);
  };

  return (
    <div
      className="card text-light shadow-lg"
      style={{
        borderRadius: 16,
        border: "2px solid #1aff64",
        backdropFilter: "blur(10px)",
        background: `
          linear-gradient(180deg, rgba(0,40,20,0.9), rgba(0,10,5,0.95)),
          repeating-linear-gradient(
            0deg,
            rgba(0,255,100,0.06),
            rgba(0,255,100,0.06) 1px,
            transparent 1px,
            transparent 24px
          ),
          #020704
        `,
        boxShadow: "0 0 30px rgba(0,255,120,0.2)"
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        className="card-header bg-transparent"
        style={{
          borderBottom: "1px solid rgba(0,255,100,0.35)",
          paddingBottom: 10
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h6
            className="mb-0 fw-bold"
            style={{ letterSpacing: 2, color: "#1aff64" }}
          >
            SYSTEM CONTROL
          </h6>

          {/* ===== STATUS BAR ===== */}
          <div className="d-flex gap-3">
            <Status label="SYSTEM" active />
            <Status label="TRAFFIC" active={points.length > 0} />
            <Status label="ALERT" danger={conflictCount > 0} />
          </div>
        </div>

        {/* ===== SIGNAL BAR ===== */}
        <div
          style={{
            height: 4,
            marginTop: 8,
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,100,0.6), transparent)",
            animation: "scan 2.5s linear infinite"
          }}
        />
      </div>

      {/* ===== BODY ===== */}
      <div className="card-body">
        {/* ===== HUD INFO ===== */}
        <div className="row text-center mb-3">
          <Hud label="AIRCRAFT" value={points.length} />
          <Hud label="CONFLICT" value={conflictCount} danger />
          <Hud label="LOAD" value={`${Math.round(trafficLevel)}%`} />
        </div>

        {/* ===== INPUT ===== */}
        <div className="mb-3">
          <label className="form-label text-secondary small">
            JUMLAH ARMADA (ACFT)
          </label>
          <input
            type="number"
            min="2"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="form-control"
            style={{
              background: "rgba(0,0,0,0.75)",
              color: "#1aff64",
              border: "1px solid rgba(0,255,100,0.4)"
            }}
          />
        </div>

        {/* ===== BUTTON ===== */}
        <button
          onClick={generatePoints}
          className="btn w-100 fw-bold mb-3"
          style={{
            color: "#1aff64",
            border: "2px solid #1aff64",
            background: "transparent",
            letterSpacing: 1
          }}
        >
          GENERATE RADAR POINTS
        </button>
      </div>

      <div className="card-footer bg-transparent text-center pb-3">
        <small style={{ fontSize: "0.7rem", color: "#3aff8f" }}>
          Air Traffic Simulation v1.1 — 2026
        </small>
      </div>

      {/* ===== ANIMATION ===== */}
      <style>
        {`
          @keyframes scan {
            from { background-position: 0%; }
            to { background-position: 200%; }
          }
        `}
      </style>
    </div>
  );
}

/* ===== MINI COMPONENTS ===== */
const Status = ({ label, active, danger }) => (
  <span
    style={{
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 12,
      border: `1px solid ${
        danger ? "#ff3b3b" : active ? "#1aff64" : "#555"
      }`,
      color: danger ? "#ff3b3b" : active ? "#1aff64" : "#777"
    }}
  >
    {label}
  </span>
);

const Hud = ({ label, value, danger }) => (
  <div className="col">
    <div style={{ fontSize: 10, color: "#7dffb3" }}>{label}</div>
    <div
      style={{
        fontSize: 18,
        fontWeight: "bold",
        color: danger ? "#ff3b3b" : "#1aff64"
      }}
    >
      {value}
    </div>
  </div>
);

export default ControlPanel;
