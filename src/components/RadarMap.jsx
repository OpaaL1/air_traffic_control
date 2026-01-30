// RadarMap.jsx
export function drawRadarMap(ctx, center = 250) {
  ctx.save();

  /* =========================
     MOUNTAIN AREA SHADING
  ========================== */
  ctx.fillStyle = "#002200";

  const mountainZones = [
    { x: center - 140, y: center - 40, r: 70 },
    { x: center - 60,  y: center + 30, r: 90 },
    { x: center + 80,  y: center - 20, r: 60 }
  ];

  mountainZones.forEach(z => {
    ctx.beginPath();
    ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
    ctx.fill();
  });

  /* =========================
     CONTOUR LINES (ELEVATION)
  ========================== */
  ctx.strokeStyle = "#003800";
  ctx.lineWidth = 1;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(
      center - 60,
      center,
      100 - i * 20,
      60 - i * 12,
      Math.PI / 6,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(
      center + 80,
      center - 30,
      80 - i * 15,
      50 - i * 10,
      -Math.PI / 8,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  /* =========================
     RIDGE LINE
  ========================== */
  ctx.strokeStyle = "#004400";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(center - 200, center + 40);
  ctx.lineTo(center - 120, center + 10);
  ctx.lineTo(center - 40,  center + 30);
  ctx.lineTo(center + 40,  center - 10);
  ctx.lineTo(center + 120, center + 20);
  ctx.lineTo(center + 200, center - 10);
  ctx.stroke();

  /* =========================
     ELEVATION LABEL
  ========================== */
  ctx.fillStyle = "#005500";
  ctx.font = "11px Arial";
  ctx.fillText("MT AREA > 7000 FT", center - 120, center - 90);

  ctx.restore();
}
