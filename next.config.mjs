import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");

    // Hard fail: prevent any runtime/build usage of react-router
    config.resolve.alias["react-router-dom"] = false;
    config.resolve.alias["react-router"] = false;

    return config;
  },
};

export default nextConfig;
