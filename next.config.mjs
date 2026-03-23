import { API_URL } from "./src/api/jumpersHeaven.js";

const nextConfig = {
  compress: true,
  reactCompiler: true,
  devIndicators: false,
  productionBrowserSourceMaps: true,

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  async rewrites() {
    return [
      { source: "/api/localhost/:path*", destination: `${API_URL}/:path*` },
    ];
  },
};

export default nextConfig;
