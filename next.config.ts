/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Only use basePath in production
  basePath: process.env.NODE_ENV === 'production' ? '/superhuman-benchmark' : '',
  // Disable image optimization since it requires a server
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig