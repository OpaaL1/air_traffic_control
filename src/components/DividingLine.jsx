// DividingLine.jsx
export function drawDividingLine({
  ctx,
  x,
  canvasSize,
  planes = [],
  dangerDistance = 25
}) {
  if (x === null || x === undefined) return;

  const time = Date.now();
  ctx.save();

  /* ================= ANIMATED GLOW LINE ================= */
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = -time / 40;

  // Glow layer
  ctx.strokeStyle = "#ff0055";
  ctx.shadowColor = "#ff0055";
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvasSize);
  ctx.stroke();

  // Core line
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#ffffff";

  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvasSize);
  ctx.stroke();

  ctx.setLineDash([]);

  /* ================= X LABEL ================= */
  const midY = canvasSize / 2;
  const label = `X : ${Math.round(x)}`;
  ctx.font = "11px monospace";
  const textWidth = ctx.measureText(label).width;

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(x + 8, midY - 22, textWidth + 8, 16);

  ctx.fillStyle = "#ff5577";
  ctx.fillText(label, x + 12, midY - 10);

  /* ================= WARNING (TEXT ONLY) ================= */
  planes.forEach((plane) => {
    const distance = Math.abs(plane.x - x);

    if (distance <= dangerDistance) {
      ctx.font = "12px monospace";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText("⚠ WARNING", plane.x, plane.y - 14);
    }
  });

  ctx.restore();
}
