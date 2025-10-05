import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Only expose public environment variables to the client
  // Server-only variables (like PPLX_API_KEY) are automatically kept server-side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
