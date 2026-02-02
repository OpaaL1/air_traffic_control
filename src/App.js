import React, { useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Pastikan CSS kamu tetap di-import
import ControlPanel from './components/ControlPanel';
import RadarCanvas from './components/RadarCanvas';
import { calculateMetrics } from './logic/LogicDivideAndConquer';

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
    <div 
      className="container-fluid bg-dark text-white vh-100 p-0 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/background1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Header Area */}
      <header 
        className="p-3 border-bottom border-secondary bg-black d-flex justify-content-between align-items-center"
        style={{ position: 'relative', zIndex: 10 }}
      >
        <h4 className="m-0 text-success fw-bold text-uppercase">
          SISTEM ATC PESAWAT
        </h4>
        <span className="badge border border-success text-success small px-3 py-2">RADAR ACTIVE</span>
      </header>

      <div className="row g-0 h-100" style={{ position: 'relative', zIndex: 5 }}>
        {/* KIRI: CONTROL PANEL */}
        <div className="col-md-3 border-end border-secondary p-4 bg-dark bg-opacity-50">
          <ControlPanel points={points} setPoints={setPoints} />
        </div>

        {/* TENGAH: RADAR DISPLAY */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-transparent">
          <RadarCanvas points={points} setAnalysis={updateAnalysis} />
        </div>

        {/* KANAN: ALGORITHM ANALYSIS */}
        <div className="col-md-3 border-start border-secondary p-4 bg-black bg-opacity-75">
          <h5 className="text-info fw-bold mb-4">ALGORITHM ANALYSIS</h5>
          
          {/* Box Monitoring Jarak */}
          <div className="p-3 border border-secondary rounded mb-4 bg-dark">
            <p className="small text-secondary mb-1">MINIMUM DISTANCE</p>
            <h2 className={analysis.distance < 60 ? "text-danger" : "text-success"}>
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
                <tr className="text-info text-center">
                  <th>Metric</th>
                  <th>Brute Force</th>
                  <th>D&C</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Complexity</td>
                  <td>O(n<sup>2</sup>)</td>
                  <td className="text-info fw-bold">O(n log n)</td>
                </tr>
                <tr>
                  <td>Est. Steps</td>
                  <td>{metrics.bf}</td>
                  <td className="text-success fw-bold">{metrics.dc}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-center text-warning p-2">
                    D&C is <b>{metrics.efficiency}%</b> more efficient
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detail Pesawat Terdekat */}
          {analysis.pair && (
            <div className="mt-4 p-3 border border-info rounded bg-info bg-opacity-10">
              <p className="small text-info mb-1 fw-bold">CLOSEST PAIR DATA</p>
              <div style={{ fontSize: '11px' }} className="font-monospace text-light opacity-75">
                TARGET 1: <span className="text-info">{analysis.pair[0].id}</span> <br/>
                TARGET 2: <span className="text-info">{analysis.pair[1].id}</span> <br/>
                <hr className="my-2 border-info opacity-25" />
                D&C Split Center: {((analysis.pair[0].x + analysis.pair[1].x) / 2).toFixed(1)} px
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;