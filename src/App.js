import React, { useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ControlPanel from './components/ControlPanel';
import RadarCanvas from './components/RadarCanvas';
import { calculateMetrics } from './logic/LogicDivideAndConquer'; // Import fungsi metrik

function App() {
  const [points, setPoints] = useState([]);
  const [analysis, setAnalysis] = useState({
    distance: 0,
    pair: null,
  });

  const updateAnalysis = useCallback((data) => {
    setAnalysis(data);
  }, []);

  // Mengambil metrik performa dari file logika
  const metrics = calculateMetrics(points.length);

  return (
    <div className="container-fluid bg-dark text-white vh-100 p-0 overflow-hidden">
      {/* Header Area */}
      <header className="p-3 border-bottom border-secondary bg-black d-flex justify-content-between align-items-center">
        <h4 className="m-0 text-success fw-bold">
          SISTEM ATC PESAWAT
        </h4>
        <span className="badge border border-success text-success small">RADAR ACTIVE</span>
      </header>

      <div className="row g-0 h-100">
        {/* KIRI: CONTROL PANEL */}
        <div className="col-md-3 border-end border-secondary p-4 bg-dark bg-opacity-25">
          <ControlPanel points={points} setPoints={setPoints} />
        </div>

        {/* TENGAH: RADAR DISPLAY */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-black">
          <RadarCanvas points={points} setAnalysis={updateAnalysis} />
        </div>

        {/* KANAN: ALGORITHM ANALYSIS */}
        <div className="col-md-3 border-start border-secondary p-4 bg-black">
          <h5 className="text-info fw-bold mb-4">ALGORITHM ANALYSIS</h5>
          
          {/* Box Monitoring Jarak */}
          <div className="p-3 border border-secondary rounded mb-4 bg-dark bg-opacity-10">
            <p className="small text-secondary mb-1">MINIMUM DISTANCE</p>
            <h2 className={analysis.distance < 60 ? "text-danger animate-pulse" : "text-success"}>
              {analysis.distance ? analysis.distance.toFixed(2) : "0.00"} <span className="h6">NM</span>
            </h2>
            <p className={`small fw-bold mb-0 ${analysis.distance < 60 ? "text-danger" : "text-success"}`}>
              STATUS: {analysis.distance < 60 ? "⚠ COLLISION ALERT" : "✓ CLEAR"}
            </p>
          </div>

          {/* Tabel Perbandingan Performa */}
          <div className="table-responsive">
            <table className="table table-dark table-sm table-bordered border-secondary small">
              <thead>
                <tr className="text-info">
                  <th>Metric</th>
                  <th>Brute Force</th>
                  <th>D&C (Active)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Complexity</td>
                  {/* Perbaikan: Menggunakan tag sup agar pangkat terlihat rapi tanpa karakter aneh */}
                  <td>O(n<sup>2</sup>)</td>
                  <td className="text-info fw-bold">O(n log n)</td>
                </tr>
                <tr>
                  <td>Est. Steps</td>
                  <td>{metrics.bf}</td>
                  <td className="text-success fw-bold">{metrics.dc}</td>
                </tr>
                <tr>
                  <td>Efficiency</td>
                  <td colSpan="2" className="text-center text-warning small">
                    D&C is {metrics.efficiency}% more efficient
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detail Pesawat Terdekat */}
          {analysis.pair && (
            <div className="mt-4 p-3 border border-info rounded bg-info bg-opacity-10">
              <p className="small text-info mb-1 fw-bold">CLOSEST PAIR DATA</p>
              <div style={{ fontSize: '11px' }} className="font-monospace text-light">
                TARGET 1: {analysis.pair[0].id} <br/>
                TARGET 2: {analysis.pair[1].id} <br/>
                <hr className="my-2 border-info opacity-25" />
                D&C Split Center: {(analysis.pair[0].x + analysis.pair[1].x) / 2} px
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;