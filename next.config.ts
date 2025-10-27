import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
=======
  // Remove static export for custom server compatibility
  // output: 'export', // Commented out for custom server
  
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
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
