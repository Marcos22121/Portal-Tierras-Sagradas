/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // ─── Performance optimizations ──────────────────────────────
  // Reduce la cantidad de output en la consola
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

};

module.exports = nextConfig;
