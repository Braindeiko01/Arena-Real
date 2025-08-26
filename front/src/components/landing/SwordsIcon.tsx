import React from 'react';

interface SwordsIconProps {
  className?: string;
  size?: number;   // opcional: controla ancho y alto juntos
  width?: number;  // opcional: ancho específico
  height?: number; // opcional: alto específico
}

const SwordsIcon: React.FC<SwordsIconProps> = ({
  className = '',
  size = 200,
  width,
  height,
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={width ?? size}
      height={height ?? size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
          <stop offset="50%" stopColor="#DAA520" stopOpacity={1} />
          <stop offset="100%" stopColor="#B8860B" stopOpacity={1} />
        </linearGradient>
        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" stopOpacity={1} />
          <stop offset="50%" stopColor="#654321" stopOpacity={1} />
          <stop offset="100%" stopColor="#3E2723" stopOpacity={1} />
        </linearGradient>
      </defs>

      {/* Espada trasera (derecha) */}
      <g transform="rotate(45 100 100)">
        <path
          d="M98 125 L102 125 L102 122 L103 120 L103 35 L100 25 L97 35 L97 120 L98 122 Z"
          fill="url(#goldGradient)"
          stroke="#DAA520"
          strokeWidth="0.5"
        />
        <path
          d="M97 120 L97 35 L100 25 L103 35 L103 120"
          fill="none"
          stroke="#FFD700"
          strokeWidth="0.8"
          opacity="0.9"
        />
        <rect
          x="82"
          y="125"
          width="36"
          height="4"
          fill="url(#goldGradient)"
          stroke="#B8860B"
          strokeWidth="0.5"
          rx="2"
        />
        <rect
          x="97"
          y="129"
          width="6"
          height="24"
          fill="url(#handleGradient)"
          stroke="#2E1A0F"
          strokeWidth="0.5"
          rx="1"
        />
        <rect x="97" y="131" width="6" height="1" fill="#654321" />
        <rect x="97" y="135" width="6" height="1" fill="#654321" />
        <rect x="97" y="139" width="6" height="1" fill="#654321" />
        <rect x="97" y="143" width="6" height="1" fill="#654321" />
        <rect x="97" y="147" width="6" height="1" fill="#654321" />
        <circle
          cx="100"
          cy="158"
          r="7"
          fill="url(#goldGradient)"
          stroke="#B8860B"
          strokeWidth="0.5"
        />
        <circle cx="100" cy="158" r="4" fill="#FFD700" opacity="0.7" />
      </g>

      {/* Espada frontal (izquierda) */}
      <g transform="rotate(-45 100 100)">
        <path
          d="M98 125 L102 125 L102 122 L103 120 L103 35 L100 25 L97 35 L97 120 L98 122 Z"
          fill="url(#goldGradient)"
          stroke="#DAA520"
          strokeWidth="0.5"
        />
        <path
          d="M97 120 L97 35 L100 25 L103 35 L103 120"
          fill="none"
          stroke="#FFD700"
          strokeWidth="0.8"
          opacity="0.9"
        />
        <rect
          x="82"
          y="125"
          width="36"
          height="4"
          fill="url(#goldGradient)"
          stroke="#B8860B"
          strokeWidth="0.5"
          rx="2"
        />
        <rect
          x="97"
          y="129"
          width="6"
          height="24"
          fill="url(#handleGradient)"
          stroke="#2E1A0F"
          strokeWidth="0.5"
          rx="1"
        />
        <rect x="97" y="131" width="6" height="1" fill="#654321" />
        <rect x="97" y="135" width="6" height="1" fill="#654321" />
        <rect x="97" y="139" width="6" height="1" fill="#654321" />
        <rect x="97" y="143" width="6" height="1" fill="#654321" />
        <rect x="97" y="147" width="6" height="1" fill="#654321" />
        <circle
          cx="100"
          cy="158"
          r="7"
          fill="url(#goldGradient)"
          stroke="#B8860B"
          strokeWidth="0.5"
        />
        <circle cx="100" cy="158" r="4" fill="#FFD700" opacity="0.7" />
      </g>
    </svg>
  );
};

export default SwordsIcon;
