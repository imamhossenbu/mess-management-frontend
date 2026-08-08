// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Turbopack এর জন্য এই config
  experimental: {
    optimizeCss: false,
  },
  // ✅ Or if you want to use Turbopack
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
};

module.exports = nextConfig;
