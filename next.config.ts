import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow all https hosts
      },
      {
        protocol: 'http',
        hostname: '**', // (optional) allow http too
      },
    ],
  },
}

export default nextConfig
