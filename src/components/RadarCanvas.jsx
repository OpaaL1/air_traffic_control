import React, { useEffect, useRef } from "react";
import { drawDividingLine } from "./DividingLine";
import { drawRadarMap } from "./RadarMap"

const SPEED = 0.1; // KECEPATAN PESAWAT (SATU SUMBER)

function RadarCanvas({ points, dividingLineX }) {
  const canvasRef = useRef(null);
  const pointsRef = useRef(points);

  const size = 500;
  const center = size / 2;
  const radius = size / 2 - 10;

  // sync state -> ref
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      /* === Radar Circle === */
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.stroke();

      /* === Radar Grid === */
      ctx.strokeStyle = "#006600";
      ctx.lineWidth = 1;
      for (let r = radius / 4; r < radius; r += radius / 4) {
        ctx.beginPath();
        ctx.arc(center, center, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(center, center - radius);
      ctx.lineTo(center, center + radius);
      ctx.moveTo(center - radius, center);
      ctx.lineTo(center + radius, center);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.clip();

      drawRadarMap(ctx, center);
      drawDividingLine({ ctx, x: dividingLineX, canvasSize: size });

      /* === Pesawat === */
      pointsRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      const angle = Math.atan2(p.vy, p.vx);

      // 1. GAMBAR IKON PESAWAT (Rotasi)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(angle);
      ctx.font = "16px Arial";
      ctx.fillStyle = "#00ff00"; // Hijau ATC
      ctx.fillText("✈", -8, 6);
      ctx.restore();

      // 2. GAMBAR LABEL DATA (Flight Level & Koordinat)
      ctx.save();
      ctx.font = "10px Monospace";
      ctx.fillStyle = "#00ff00"; // Pastikan warna diset di sini
      
      const posText = `${p.x.toFixed(0)},${p.y.toFixed(0)}`;
      const altText = `F${p.alt || '200'}`; // Fallback ke F200 jika alt belum ada

      // Render Label di samping ikon
      ctx.fillText(posText, p.x + 12, p.y); 
      ctx.fillText(altText, p.x + 12, p.y + 12); 
      ctx.restore(); // Tutup save label

      // 3. LOGIKA RESPAWN
      if (p.x < -50 || p.x > size + 50 || p.y < -50 || p.y > size + 50) {
        const side = Math.floor(Math.random() * 4);
        let spawnX, spawnY, spawnAngle;

        if (side === 0) { // kiri
          spawnX = -40; spawnY = Math.random() * size;
          spawnAngle = Math.random() * Math.PI - Math.PI / 2;
        } else if (side === 1) { // kanan
          spawnX = size + 40; spawnY = Math.random() * size;
          spawnAngle = Math.random() * Math.PI + Math.PI / 2;
        } else if (side === 2) { // atas
          spawnX = Math.random() * size; spawnY = -40;
          spawnAngle = Math.random() * Math.PI;
        } else { // bawah
          spawnX = Math.random() * size; spawnY = size + 40;
          spawnAngle = Math.random() * Math.PI + Math.PI;
        }

        p.x = spawnX;
        p.y = spawnY;
        p.vx = Math.cos(spawnAngle) * SPEED;
        p.vy = Math.sin(spawnAngle) * SPEED;
        // Berikan ketinggian baru saat respawn
        p.alt = Math.floor(Math.random() * 300) + 100;
      }
    });

      ctx.restore();
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        backgroundColor: "black",
        borderRadius: "50%"
      }}
    />
  );
}

export default RadarCanvas;
