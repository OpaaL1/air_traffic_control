// RadarMap.jsx
export function drawRadarMap(ctx, center = 250) {
  ctx.save();

  /* 1. BACKGROUND */
  const bg = ctx.createRadialGradient(center, center, 0, center, center, 220);
  bg.addColorStop(0, "#001a00");
  bg.addColorStop(1, "#000800");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, center * 2, center * 2);

  /* 2. RADAR GRID */
  ctx.strokeStyle = "rgba(0,255,120,0.15)";
  for (let r = 40; r <= 200; r += 40) {
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  /* 3. FUNGSI PEMBANTU (Didefinisikan di luar pemanggilan) */
  const drawMountain = (x, y, width, height) => {
    ctx.save();
    ctx.fillStyle = "#003300";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y - height);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawGentleHill = (x, y, width, height) => {
    ctx.save();
    ctx.fillStyle = "#002a00";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + width / 2, y - height, x + width, y);
    ctx.fill();
    ctx.strokeStyle = "#003d00";
    ctx.stroke();
    ctx.restore();
  };

  /* 4. EKSEKUSI GAMBAR */
  drawGentleHill(center - 180, center + 40, 150, 40);
  drawGentleHill(center - 80, center + 60, 200, 50);
  drawGentleHill(center + 50, center + 30, 120, 35);

  drawMountain(center - 150, center + 20, 80, 60);
  drawMountain(center - 100, center + 40, 100, 80);
  drawMountain(center + 60, center + 30, 70, 50);

  /* 5. LABEL & COMPASS */
  ctx.fillStyle = "#00ff88";
  ctx.font = "11px monospace";
  ctx.fillText("MT AREA > 7000 FT", center - 130, center - 105);
  // ... sisa kode compass kamu ...
  ctx.restore();
}