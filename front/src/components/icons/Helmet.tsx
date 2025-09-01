import * as React from 'react';

const HelmetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M12 3v5l3 2-3 2-3-2 3-2" />
    <path d="M9 14h6v8H9z" />
    <path d="M4 22h16" />
  </svg>
);

export default HelmetIcon;
