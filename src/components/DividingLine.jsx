import React from 'react';

const DividingLine = ({ x, color = '#ff0055', label = 'D&C Split' }) => {
  // Jika koordinat x tidak ada, jangan gambar apa-apa
  if (x === undefined || x === null) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: 0,
        bottom: 0,
        width: '2px',
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}`, // Efek glow neon
        zIndex: 10,
        transition: 'all 0.5s ease-in-out', // Animasi halus saat garis berpindah
      }}
    >
      {/* Label kecil di atas garis */}
      <span
        style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          fontSize: '10px',
          color: color,
          whiteSpace: 'nowrap',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '2px 5px',
          borderRadius: '3px'
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default DividingLine;