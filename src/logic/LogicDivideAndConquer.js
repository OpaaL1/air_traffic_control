// 1. Fungsi pembantu: Menghitung jarak Euclidean antara dua titik
const dist = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// 2. Algoritma Brute Force (Base case untuk < 4 titik)
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

// 3. Inti Algoritma Divide & Conquer (D&C)
export function findClosestPair(points) {
  if (points.length < 2) return { min: Infinity, pair: null };

  // Sort awal (Preprocessing)
  const sortedX = [...points].sort((a, b) => a.x - b.x);
  const sortedY = [...points].sort((a, b) => a.y - b.y);

  function recursive(ptsX, ptsY) {
    // Jika titik sedikit, gunakan Brute Force
    if (ptsX.length <= 3) return bruteForce(ptsX);

    // Tentukan titik tengah
    const mid = Math.floor(ptsX.length / 2);
    const midPoint = ptsX[mid];

    // Bagi ptsY menjadi dua bagian (kiri dan kanan midPoint)
    const leftY = ptsY.filter(p => p.x <= midPoint.x);
    const rightY = ptsY.filter(p => p.x > midPoint.x);

    // Rekursi kiri dan kanan
    const leftRes = recursive(ptsX.slice(0, mid), leftY);
    const rightRes = recursive(ptsX.slice(mid), rightY);

    // Ambil hasil terkecil dari kedua sisi
    let dMin = leftRes.min < rightRes.min ? leftRes : rightRes;

    // Filter "Strip": Titik-titik yang jarak X-nya ke garis tengah < dMin
    const strip = ptsY.filter(p => Math.abs(p.x - midPoint.x) < dMin.min);

    // Cek titik di dalam strip (Hanya perlu cek maksimal 7 titik setelahnya)
    for (let i = 0; i < strip.length; i++) {
      for (
        let j = i + 1; 
        j < strip.length && (strip[j].y - strip[i].y) < dMin.min; 
        j++
      ) {
        let d = dist(strip[i], strip[j]);
        if (d < dMin.min) {
          dMin = { min: d, pair: [strip[i], strip[j]] };
        }
      }
    }
    return dMin;
  }

  return recursive(sortedX, sortedY);
}

// 4. Metrik Analisis untuk Tabel di UI
export function calculateMetrics(n) {
  if (n < 2) return { bf: 0, dc: 0, efficiency: 0 };

  // Rumus Brute Force: n(n-1)/2 perbandingan
  const bf = Math.round((n * (n - 1)) / 2);
  
  // Rumus D&C: n * log2(n) perbandingan
  const dc = Math.round(n * Math.log2(n));

  // Menghitung persentase efisiensi
  const efficiency = bf > 0 ? Math.round(((bf - dc) / bf) * 100) : 0;

  return {
    bf: bf.toLocaleString(),
    dc: dc.toLocaleString(),
    efficiency: efficiency > 0 ? efficiency : 0
  };
}