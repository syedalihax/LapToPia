import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Logo({ className = "w-8 h-8", inverted = false }) {
  let isDark = false;
  try {
    const themeCtx = useTheme();
    isDark = themeCtx.isDark;
  } catch {
    isDark = false;
  }

  // Geometric circular monogram logo matching the user's uploaded 1:1 brand mark
  const strokeColor = inverted ? (isDark ? '#09090B' : '#FAFAFA') : (isDark ? '#FAFAFA' : '#09090B');

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-current"
      >
        {/* Outer thick circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={strokeColor}
          strokeWidth="14"
        />
        {/* Stylized geometric vertical L bar */}
        <rect
          x="35"
          y="16"
          width="13"
          height="54"
          fill={strokeColor}
        />
        {/* Stylized horizontal L base */}
        <rect
          x="35"
          y="57"
          width="34"
          height="13"
          fill={strokeColor}
        />
        {/* Diagonal Q / Architect anchor tail */}
        <path
          d="M 60 57 L 82 86 L 70 86 L 50 62 Z"
          fill={strokeColor}
        />
      </svg>
    </div>
  );
}
