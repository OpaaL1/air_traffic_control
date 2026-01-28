import React, { useEffect, useRef } from "react";

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/* ================= CLOSEST PAIR (D&C) =========== */
function closestPair(points) {
  if (points.length < 2) return null;

  const px = [...points].sort((a, b) => a.x - b.x);
  const py = [...points].sort((a, b) => a.y - b.y);

  return divide(px, py);
}

function divide(px, py) {
  const n = px.length;

  if (n <= 3) {
    let min = Infinity;
    let pair = null;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = distance(px[i], px[j]);
        if (d < min) {
          min = d;
          pair = [px[i], px[j]];
        }
      }
    }
    return { pair, dist: min, midX: px[Math.floor(n / 2)].x };
  }

  const mid = Math.floor(n / 2);
  const midX = px[mid].x;

  const Qx = px.slice(0, mid);
  const Rx = px.slice(mid);

  const Qy = py.filter(p => p.x <= midX);
  const Ry = py.filter(p => p.x > midX);

  const left = divide(Qx, Qy);
  const right = divide(Rx, Ry);

  let best = left.dist < right.dist ? left : right;

  const strip = py.filter(p => Math.abs(p.x - midX) < best.dist);

  for (let i = 0; i < strip.length; i++) {
    for (let j = i + 1; j < strip.length && strip[j].y - strip[i].y < best.dist; j++) {
      const d = distance(strip[i], strip[j]);
      if (d < best.dist) {
        best = { pair: [strip[i], strip[j]], dist: d, midX };
      }
    }
  }

  return { ...best, midX };
}

/* ================= RADAR CANVAS ================= */
function RadarCanvas({ points }) {
  const canvasRef = useRef(null);
  const size = 500;
  const center = size / 2;
  const radius = size / 2 - 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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

    // Cross lines
    ctx.beginPath();
    ctx.moveTo(center, center - radius);
    ctx.lineTo(center, center + radius);
    ctx.moveTo(center - radius, center);
    ctx.lineTo(center + radius, center);
    ctx.stroke();

    /* === Clip agar titik hanya di dalam radar === */
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();

    /* === Draw Points === */
    points.forEach(p => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#00ff00";
    ctx.fillText("✈", p.x - 8, p.y + 6);
  });

    if (points.length >= 2) {
      const result = closestPair(points);
      if (!result) return;

      const { pair, midX } = result;

      /* === Dividing Line === */
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, size);
      ctx.stroke();
      ctx.setLineDash([]);

      /* === Closest Pair Line === */
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pair[0].x, pair[0].y);
      ctx.lineTo(pair[1].x, pair[1].y);
      ctx.stroke();
    }

    ctx.restore();
  }, [points]);

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