import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The previous configuration attempted to set a custom
  // Cross-Origin-Opener-Policy header for authentication pages.
  // This interfered with Firebase Auth popups, causing errors like:
  // "Cross-Origin-Opener-Policy policy would block the window.close call.".
  // Removing the header configuration allows Firebase to manage the popup
  // lifecycle without being blocked by browser policies.
};

export default nextConfig;
