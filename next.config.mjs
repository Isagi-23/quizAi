/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/(.*)", // Apply to all API routes
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate", // Prevent caching for dynamic API responses
          },
        ],
      },
    ];
  },
};
export default nextConfig;
