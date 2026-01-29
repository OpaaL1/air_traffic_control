import React from 'react';

const DividingLine = ({
  x,
  color = '#ff0055',
  label = 'D&C Split'
}) => {
  if (x === undefined || x === null) return null;

  return (
    <>
      
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
          zIndex: 10
        }}
      />

      
      <div
        style={{
          position: 'absolute',
          left: `${x - 4}px`,
          top: '50%',               
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
          zIndex: 11
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: `${x + 8}px`,
          top: '50%',
          transform: 'translateY(-150%)',
          fontSize: '10px',
          color: color,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '2px 6px',
          borderRadius: '4px',
          zIndex: 12,
          whiteSpace: 'nowrap'
        }}
      >
        x: {Math.round(x)} | y: 50%
      </div>
    </>
  );
};

export default DividingLine;
