/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // ⬇️ put it at TOP LEVEL for Next.js 16
  allowedDevOrigins: [
    'http://192.168.110.233:3000',
  ],
};

export default nextConfig;
