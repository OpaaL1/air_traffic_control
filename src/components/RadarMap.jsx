// RadarMap.jsx
export function drawRadarMap(ctx, center = 250) {
  ctx.save();

  /* BACKGROUND */
  const bg = ctx.createRadialGradient(center, center, 0, center, center, 220);
  bg.addColorStop(0, "#001a00");
  bg.addColorStop(1, "#000800");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, center * 2, center * 2);

  /* RADAR GRID */
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

  /* MOUNTAIN AREA */
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

  /* RIDGE */
  ctx.strokeStyle = "#00aa44";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center - 190, center + 50);
  ctx.lineTo(center - 110, center + 15);
  ctx.lineTo(center - 30,  center + 35);
  ctx.lineTo(center + 40,  center - 5);
  ctx.lineTo(center + 120, center + 25);
  ctx.lineTo(center + 190, center - 15);
  ctx.stroke();

  /* LABEL */
  ctx.fillStyle = "#00ff88";
  ctx.font = "11px monospace";
  ctx.fillText("MT AREA > 7000 FT", center - 130, center - 105);

  /* COMPASS */
  ctx.fillStyle = "#00ff88";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";

  ctx.fillText("N", center, center - 210);
  ctx.fillText("S", center, center + 225);
  ctx.fillText("W", center - 220, center + 5);
  ctx.fillText("E", center + 220, center + 5);

  ctx.strokeStyle = "rgba(0,255,120,0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(center, center - 200);
  ctx.lineTo(center, center - 185);
  ctx.moveTo(center, center + 200);
  ctx.lineTo(center, center + 185);
  ctx.moveTo(center - 200, center);
  ctx.lineTo(center - 185, center);
  ctx.moveTo(center + 200, center);
  ctx.lineTo(center + 185, center);
  ctx.stroke();

  ctx.restore();
}
