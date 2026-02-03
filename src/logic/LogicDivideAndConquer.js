const dist = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

// Algoritma Brute Force
function bruteForce(pts) {
  let min = Infinity;
  let pair = null;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      let d = dist(pts[i], pts[j]);
      if (d < min) {
        min = d;
        pair = [pts[i], pts[j]];
      }
    }
  }
  return { min, pair };
}

// Inti Algoritma Divide & Conquer
export function findClosestPair(points) {
  if (points.length < 2) return { min: Infinity, pair: null };
  
  // 1. Sort berdasarkan X
  const sortedX = [...points].sort((a, b) => a.x - b.x);
  
  function recursive(pts) {
    if (pts.length <= 3) return bruteForce(pts);

    const mid = Math.floor(pts.length / 2);
    const midPoint = pts[mid];

    // DIVIDE
    const leftRes = recursive(pts.slice(0, mid));
    const rightRes = recursive(pts.slice(mid));

    // CONQUER
    let dMin = leftRes.min < rightRes.min ? leftRes : rightRes;

    // COMBINE
    const strip = pts.filter(p => Math.abs(p.x - midPoint.x) < dMin.min);
    const stripSortedY = strip.sort((a, b) => a.y - b.y);

    for (let i = 0; i < stripSortedY.length; i++) {
      for (let j = i + 1; j < stripSortedY.length && (stripSortedY[j].y - stripSortedY[i].y) < dMin.min; j++) {
        let d = dist(stripSortedY[i], stripSortedY[j]);
        if (d < dMin.min) {
          dMin = { min: d, pair: [stripSortedY[i], stripSortedY[j]] };
        }
      }
    }

    return dMin;
  }

  return recursive(sortedX);
}

export function calculateMetrics(n) {
  if (n < 2) return { bf: 0, dc: 0, efficiency: 0 };

  // Rumus Brute Force: n(n-1)/2
  const bf = (n * (n - 1)) / 2; 
  
  // Rumus Divide & Conquer: n log n
  const dc = Math.round(n * Math.log2(n)); 
  
  // Menghitung persentase efisiensi
  const efficiency = ((1 - dc / (bf || 1)) * 100).toFixed(1);

  return { 
    bf: Math.floor(bf), 
    dc: Math.floor(dc), 
    efficiency 
  };
}

export function benchmarkSearch(points, algorithmFn) {
  const start = performance.now();
  const result = algorithmFn(points);
  const end = performance.now();
  
  return {
    time: (end - start).toFixed(4), 
    result: result
  };
}