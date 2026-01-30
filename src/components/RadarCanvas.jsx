import React, { useEffect, useRef } from "react";
import { drawDividingLine } from "./DividingLine";
import { drawRadarMap } from "./RadarMap";
import { findClosestPair } from "../logic/LogicDivideAndConquer";

// Konstanta Radar
const SIZE = 500;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 10;
const ALERT_THRESHOLD = 60;

function RadarCanvas({ points, setAnalysis }) {

  const canvasRef = useRef(null);
  const pointsRef = useRef(points);
  const sweepAngleRef = useRef(0);

  // Sinkronisasi data points dari props ke dalam ref animasi
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      /* === 1. GAMBAR GRID RADAR === */
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;

      ctx.stroke();
      ctx.strokeStyle = "#006600";
      ctx.lineWidth = 1;

      for (let r = RADIUS / 4; r < RADIUS; r += RADIUS / 4) {
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* === 2. KONTEN RADAR (MAP & LOGIC) === */

      ctx.save();
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
      ctx.clip();

      drawRadarMap(ctx, CENTER);

      // Eksekusi Algoritma Divide and Conquer

      const result = findClosestPair(pointsRef.current);

      // Update data ke App.js (Algorithm Analysis)

      if (setAnalysis && result) {
        setAnalysis({
          distance: result.min,
          pair: result.pair
        });
      }

      // Visualisasi Garis Pembagi (Dividing Line)
      let targetX = CENTER;
      let lineColor = "#00ff00";

      if (result.min < ALERT_THRESHOLD && result.pair) {
        const [p1, p2] = result.pair;
        targetX = (p1.x + p2.x) / 2;
        lineColor = "#ff0055";
      }

      drawDividingLine({
        ctx,
        x: targetX,
        canvasSize: SIZE,
        color: lineColor,
      });



      /* === 3. SCANNING BEAM === */

      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate(sweepAngleRef.current);
      const sweepGradient = ctx.createConicGradient(0, 0, 0);
      sweepGradient.addColorStop(0, "rgba(0, 255, 0, 0.4)");
      sweepGradient.addColorStop(0.1, "rgba(0, 255, 0, 0)");
      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS, 0, Math.PI * 0.2);
      ctx.fill();
      ctx.restore();

      sweepAngleRef.current += 0.02;

      /* === 4. RENDERING PESAWAT === */

      pointsRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        const isConflict = result.pair && (p === result.pair[0] || p === result.pair[1]) && result.min < ALERT_THRESHOLD;
        const aircraftColor = isConflict ? "#ff0055" : "#00ff00";



        // Ikon Pesawat

        const angle = Math.atan2(p.vy, p.vx);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        ctx.font = "16px Arial";
        ctx.fillStyle = aircraftColor;
        ctx.fillText("✈", -8, 6);
        ctx.restore();

        // --- PERBAIKAN LABEL: Baris Bertumpuk ---
        ctx.fillStyle = aircraftColor;
        ctx.font = "10px Monospace";

        // Baris 1: ID/Callsign
        ctx.fillText(p.id, p.x + 12, p.y - 10);

        // Baris 2: Altitude (F) diletakkan di bawah baris 1
        ctx.fillText(`F${p.alt}`, p.x + 12, p.y + 2);



        // --- PERBAIKAN LOGIKA RESPAWN: Muncul dari Tepi ---
        if (p.x < -30 || p.x > SIZE + 30 || p.y < -30 || p.y > SIZE + 30) {
          const side = Math.floor(Math.random() * 4);
          if (side === 0) { p.x = -20; p.y = Math.random() * SIZE; }      // Dari Kiri
          else if (side === 1) { p.x = SIZE + 20; p.y = Math.random() * SIZE; } // Dari Kanan
          else if (side === 2) { p.x = Math.random() * SIZE; p.y = -20; } // Dari Atas
          else { p.x = Math.random() * SIZE; p.y = SIZE + 20; }          // Dari Bawah

          // Generate data baru agar pesawat tidak terlihat sama
          p.id = `AC${Math.floor(1000 + Math.random() * 9000)}`;
          p.alt = Math.floor(Math.random() * 30) + 100;
        }
      });

      /* === 5. GARIS KONFLIK (COLLISION ALERT) === */
      if (result.pair && result.min < ALERT_THRESHOLD) {
        const [p1, p2] = result.pair;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "#ff0055";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [setAnalysis]);
  return (

    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      style={{
        backgroundColor: "black",
        borderRadius: "50%",
        boxShadow: "0 0 20px rgba(0, 255, 0, 0.2)",
      }}

    />

  );

}



export default RadarCanvas;