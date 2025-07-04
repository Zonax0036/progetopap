/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'contents.mediadecathlon.com',
      },
      {
        protocol: 'https',
        hostname: 'www.futbolemotion.com',
      },
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
