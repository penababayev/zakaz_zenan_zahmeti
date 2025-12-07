// next.config.ts

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Rewrites kuralı: Bu, tarayıcının CORS politikasına takılmadan
  // /api/products isteğini doğrudan API'ye yönlendirir.
  async rewrites() {
    return [
      {
        source: '/api/products',
        destination: 'http://34.10.166.242:8001/products',
      },
    ];
  },

  // Resim Ayarları: Resimlerin geldiği harici IP adresine izin verir.
  // Bu, Next.js'in resim optimizasyonu guard'ını geçmek için gereklidir.
  images: {
    remotePatterns: [
      {
        // Resimlerinizi HTTP üzerinden çektiğiniz için protokol 'http' olmalı
        protocol: 'http', 
        hostname: '34.10.166.242',
        port: '8001',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;