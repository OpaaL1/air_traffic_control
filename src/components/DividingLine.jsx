// DividingLine.jsx
export function drawDividingLine({
  ctx,
  x,
  canvasSize,
  color = "#ff0055"
}) {
  if (x === null || x === undefined) return;

  ctx.save();

  /* ================= MAIN LINE ================= */
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvasSize);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]); // lebih rapi
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;

  ctx.stroke();

  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  /* ================= CENTER MARKER ================= */
  const midY = canvasSize / 2;

  ctx.beginPath();
  ctx.arc(x, midY, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  /* ================= LABEL ================= */
  ctx.fillStyle = color;
  ctx.font = "11px monospace";
  ctx.textAlign = "left";

  ctx.fillText(`X = ${Math.round(x)}`, x + 8, midY - 8);

  /* ================= TOP & BOTTOM TICKS ================= */
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(x - 6, 10);
  ctx.lineTo(x + 6, 10);
  ctx.moveTo(x - 6, canvasSize - 10);
  ctx.lineTo(x + 6, canvasSize - 10);
  ctx.stroke();

  ctx.restore();
}
