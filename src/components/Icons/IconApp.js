import React from 'react';

const IconApp = ({ size = 36, title = 'Mi App' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={title}
    role="img"
  >
    <rect x="3" y="3" width="18" height="18" rx="4" fill="var(--primary-color)" />
    <path d="M7 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 8h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default IconApp;
