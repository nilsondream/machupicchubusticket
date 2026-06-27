import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  serverExternalPackages: ["@prisma/client", "pg"],
};

export default nextConfig;
