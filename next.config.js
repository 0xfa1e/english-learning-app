
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 不再需要rewrites，因为我们直接在index.js中渲染内容
};

module.exports = nextConfig;
