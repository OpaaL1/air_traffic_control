// DividingLine.jsx

export function drawDividingLine({
  ctx,
  x,
  canvasSize,
  color = "#ff0055"
}) {
  if (x === null || x === undefined) return;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvasSize);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]); // ATC dashed line
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;

  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();
}