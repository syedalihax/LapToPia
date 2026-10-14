import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Logo({ className = "w-8 h-8" }) {
  const { isDark } = useTheme();

  return (
    <img
      src={isDark ? '/Dark_LOGO.png' : '/LOGO.png'}
      alt="LAPTOPIA logo"
      className={`inline-flex shrink-0 object-contain ${className}`}
    />
  );
}
