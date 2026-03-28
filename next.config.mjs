/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.CAPACITOR_BUILD ? 'export' : undefined,
  images: {
    unoptimized: process.env.CAPACITOR_BUILD ? true : false,
    remotePatterns: [
      { protocol: 'https', hostname: 'dl5zpyw5k3jeb.cloudfront.net' },
      { protocol: 'https', hostname: 'photos.petfinder.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};
export default nextConfig;
