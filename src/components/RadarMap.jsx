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

  for (let a = 0; a < 360; a += 30) {
    const rad = (a * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(center + Math.cos(rad) * 200, center + Math.sin(rad) * 200);
    ctx.stroke();
  }

  /* 3. MENGGAMBAR GUNUNG (MENGGANTIKAN BULATAN) */
  // Fungsi pembantu untuk menggambar satu gunung segitiga
  const drawMountain = (x, y, width, height) => {
    ctx.save();
    // Badan Gunung
    ctx.fillStyle = "#003300"; // Hijau gelap
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y - height);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();

  /* 3. MENGGAMBAR PERBUKITAN LANDAI (HILL SHAPE) */
  const drawGentleHill = (x, y, width, height) => {
    ctx.save();
    ctx.fillStyle = "#002a00"; // Hijau perbukitan gelap
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Menggunakan Quadratic Curve untuk membuat lengkungan landai
    // Control point berada di tengah atas, tapi ditarik agar tidak runcing
    ctx.quadraticCurveTo(x + width / 2, y - height, x + width, y);
    
    ctx.fill();

    // Tambahan sedikit outline agar bentuk perbukitan lebih tegas
    ctx.strokeStyle = "#003d00";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };

  // Kita buat perbukitan yang lebar-lebar agar terlihat landai
  drawGentleHill(center - 180, center + 40, 150, 40); // Bukit kiri lebar
  drawGentleHill(center - 80, center + 60, 200, 50);  // Bukit tengah sangat landai
  drawGentleHill(center + 50, center + 30, 120, 35);  // Bukit kanan kecil
  };

  // Titik koordinat gunung-gunung
  drawMountain(center - 150, center + 20, 80, 60);
  drawMountain(center - 100, center + 40, 100, 80);
  drawMountain(center + 60, center + 30, 70, 50);


  /* 5. LABEL */
  ctx.fillStyle = "#00ff88";
  ctx.font = "11px monospace";
  ctx.fillText("MT AREA > 7000 FT", center - 130, center - 105);

  /* 6. COMPASS (N, S, W, E) */
  ctx.fillStyle = "#00ff88";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";

  ctx.fillText("N", center, center - 210);
  ctx.fillText("S", center, center + 225);
  ctx.fillText("W", center - 220, center + 5);
  ctx.fillText("E", center + 220, center + 5);

  // Penanda arah (Tick marks)
  ctx.strokeStyle = "rgba(0,255,120,0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(center, center - 200); ctx.lineTo(center, center - 185);
  ctx.moveTo(center, center + 200); ctx.lineTo(center, center + 185);
  ctx.moveTo(center - 200, center); ctx.lineTo(center - 185, center);
  ctx.moveTo(center + 200, center); ctx.lineTo(center + 185, center);
  ctx.stroke();

  ctx.restore();
}