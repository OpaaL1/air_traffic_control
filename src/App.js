import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ControlPanel from './components/ControlPanel';
import RadarCanvas from './components/RadarCanvas';

function App() {
  // State untuk menyimpan koordinat pesawat
  const [points, setPoints] = useState([]);

  return (
    <div className="container-fluid bg-dark text-white vh-100 p-0 overflow-hidden">
      /* Header Aplikasi */
      <header className="p-3 border-bottom border-secondary bg-black">
        <h4 className="m-0 text-success fw-bold">ATC COLLISION PREDICTION SYSTEM</h4>
      </header>

      <div className="row g-0 h-100">
        /* KOLOM KIRI: Kontrol */
        <div className="col-md-3 border-end border-secondary p-4 bg-opacity-10">
          <ControlPanel points={points} setPoints={setPoints} />
        </div>

        /* KOLOM TENGAH: Visualisasi Rada */
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-black position-relative">
          <RadarCanvas points={points} />
        </div>

        /* KOLOM KANAN: Analisis Empiris */
        <div className="col-md-3 border-start border-secondary p-4">
          <h5 className="text-info">Algorithm Analysis</h5>
          <hr className="bg-secondary" />
          {/* Di sini nanti tempat tabel/grafik perbandingan waktu */}
        </div>
      </div>
    </div>
  );
}

export default App;
