import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ControlPanel from './components/ControlPanel';
import RadarCanvas from './components/RadarCanvas';

function App() {
  // State pesawat
  const [points, setPoints] = useState([]);

  // State dividing line ATC
  const [dividingLineX, setDividingLineX] = useState(250);

  return (
    <div className="container-fluid bg-dark text-white vh-100 p-0 overflow-hidden">
      {/* Header */}
      <header className="p-3 border-bottom border-secondary bg-black">
        <h4 className="m-0 text-success fw-bold">
          ATC COLLISION PREDICTION SYSTEM
        </h4>
      </header>

      <div className="row g-0 h-100">
        {/* KIRI: CONTROL */}
        <div className="col-md-3 border-end border-secondary p-4">
          <ControlPanel
            points={points}
            setPoints={setPoints}
            dividingLineX={dividingLineX}
            setDividingLineX={setDividingLineX}
          />
        </div>

        {/* TENGAH: RADAR */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-black">
          <RadarCanvas
            points={points}
            dividingLineX={dividingLineX}
          />
        </div>

        {/* KANAN: ANALYSIS */}
        <div className="col-md-3 border-start border-secondary p-4">
          <h5 className="text-info">Algorithm Analysis</h5>
          <hr className="bg-secondary" />
        </div>
      </div>
    </div>
  );
}

export default App;
