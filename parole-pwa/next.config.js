/** @type {import('next').NextConfig} */
const BASE_PATH = "/crm-scuole";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  trailingSlash: true,
  basePath: BASE_PATH,
  images: { unoptimized: true },
};

module.exports = nextConfig;
