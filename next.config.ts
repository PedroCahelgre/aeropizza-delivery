import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for custom server compatibility
  output: 'export',
  
  // Configurações de imagem
  images: {
    unoptimized: true,
  },
  
  // TypeScript e ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
