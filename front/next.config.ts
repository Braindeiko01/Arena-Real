import type {NextConfig} from 'next';

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
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin-allow-popups',
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'unsafe-none',
            },
          ],
        },
      ]
    }
    return [
      {
        source: '/login',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
      {
        source: '/register',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
