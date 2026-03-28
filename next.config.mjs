/** @type {import('next').NextConfig} */
// KNOWN VULNERABILITIES (as of 2026-03-28, npm audit):
// - GHSA-9g9p-9gw9-jx7f: Next.js self-hosted DoS via Image Optimizer remotePatterns (next 9.5.0–15.5.13)
// - GHSA-h25m-26qc-wcjf: HTTP request deserialization DoS via insecure React Server Components
// - GHSA-ggv3-7p47-pfv8: HTTP request smuggling in rewrites
// - GHSA-3x4c-7xq6-9pq8: Unbounded next/image disk cache growth (storage exhaustion)
// Upgrade to Next.js 15+ (or 16+) is planned. Force-upgrade skipped due to breaking changes.
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
