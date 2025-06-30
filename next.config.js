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
};

module.exports = nextConfig;
