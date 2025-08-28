import type { NextConfig } from 'next';

  const nextConfig: NextConfig = {
    // Allow Firebase Auth popups to close by using
    // `same-origin-allow-popups` for the Cross-Origin-Opener-Policy.
    crossOriginOpenerPolicy: 'same-origin-allow-popups',
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
    // Using the "same-origin-allow-popups" policy avoids the
    // "Cross-Origin-Opener-Policy policy would block the window.close call" error
    // logged by Firebase Auth when closing its login popup.
  };

  export default nextConfig;
