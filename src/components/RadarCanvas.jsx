import React, { useEffect, useRef } from "react";
import { drawDividingLine } from "./DividingLine";
import { drawRadarMap } from "./RadarMap";
import { findClosestPair } from "./LogicDivideAndConquer";

// 1. Pindahkan konstanta ke luar komponen agar tidak perlu masuk ke dependency array
const SIZE = 500;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 10;
const SPEED = 0.1;
const ALERT_THRESHOLD = 60; // Nilai standar agar visualisasi terlihat jelas

function RadarCanvas({ points }) {
  const canvasRef = useRef(null);
  const pointsRef = useRef(points);
  const sweepAngleRef = useRef(0);

  // Update ref saat props points berubah
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      /* === 1. RADAR BACKGROUND (GRID) === */
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.stroke();

      //
      ctx.strokeStyle = "#006600";
      ctx.lineWidth = 1;
      for (let r = RADIUS / 4; r < RADIUS; r += RADIUS / 4) {
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(CENTER, CENTER - RADIUS);
      ctx.lineTo(CENTER, CENTER + RADIUS);
      ctx.moveTo(CENTER - RADIUS, CENTER);
      ctx.lineTo(CENTER + RADIUS, CENTER);
      ctx.stroke();

      /* === 2. RADAR CONTENT (CLIPPED) === */
      ctx.save();
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
      ctx.clip();

      drawRadarMap(ctx, CENTER);

      // --- ALGORITMA DIVIDE AND CONQUER (CLOSEST PAIR) ---
      const result = findClosestPair(pointsRef.current);

      // --- LOGIKA GARIS PEMBAGI DINAMIS ---
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

      // --- SCANNING BEAM ---
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

      // --- LAYER 3: PESAWAT ---
      pointsRef.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (!p.history) p.history = [];
        p.tick = (p.tick || 0) + 1;
        if (p.tick % 50 === 0) {
          p.history.push({ x: p.x, y: p.y });
          if (p.history.length > 4) p.history.shift();
        }

        const isConflict = result.pair && (p === result.pair[0] || p === result.pair[1]) && result.min < ALERT_THRESHOLD;
        const aircraftColor = isConflict ? "#ff0055" : "#00ff00";

        // Draw Trails
        p.history.forEach((h, i) => {
          ctx.beginPath();
          ctx.arc(h.x, h.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 0, ${0.1 * (i + 1)})`;
          ctx.fill();
        });

        // Icon & Label
        const angle = Math.atan2(p.vy, p.vx);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        ctx.font = "16px Arial";
        ctx.fillStyle = aircraftColor;
        ctx.fillText("✈", -8, 6);
        ctx.restore();

        ctx.fillStyle = aircraftColor;
        ctx.font = "10px Monospace";
        ctx.fillText(`AC${100 + index}`, p.x + 12, p.y - 10);
        ctx.fillText(`F${p.alt || "200"}`, p.x + 12, p.y + 10);

        // Respawn Logic
        if (p.x < -50 || p.x > SIZE + 50 || p.y < -50 || p.y > SIZE + 50) {
          const side = Math.floor(Math.random() * 4);
          let sx, sy, sa;
          if (side === 0) { sx = -40; sy = Math.random() * SIZE; sa = Math.random() * Math.PI - Math.PI / 2; } 
          else if (side === 1) { sx = SIZE + 40; sy = Math.random() * SIZE; sa = Math.random() * Math.PI + Math.PI / 2; } 
          else if (side === 2) { sx = Math.random() * SIZE; sy = -40; sa = Math.random() * Math.PI; } 
          else { sx = Math.random() * SIZE; sy = SIZE + 40; sa = Math.random() * Math.PI + Math.PI; }

          p.x = sx; p.y = sy;
          p.vx = Math.cos(sa) * SPEED; p.vy = Math.sin(sa) * SPEED;
          p.alt = Math.floor(Math.random() * 300) + 100;
          p.history = [];
        }
      });

      // --- GARIS HUBUNG & JARAK CLOSEST PAIR (ALERT) ---
      if (result.pair && result.min < ALERT_THRESHOLD) {
        const [p1, p2] = result.pair;
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "#ff0055";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.arc(p1.x, p1.y, 12, 0, Math.PI * 2);
        ctx.moveTo(p2.x + 12, p2.y);
        ctx.arc(p2.x, p2.y, 12, 0, Math.PI * 2);
        ctx.stroke();

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const distText = `${result.min.toFixed(1)} NM`;

        ctx.font = "bold 11px Monospace";
        const textWidth = ctx.measureText(distText).width;

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(midX - textWidth / 2 - 4, midY - 22, textWidth + 8, 14);

        ctx.fillStyle = "#ff0055";
        ctx.textAlign = "center";
        ctx.fillText(distText, midX, midY - 11);

        ctx.restore();
      }

      ctx.restore();
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []); // Array kosong karena semua variabel statis sudah berada di luar komponen

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