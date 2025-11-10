import { API_URL } from "./src/Api/jumpersHeaven.js";

const nextConfig = {
  devIndicators: false,
  reactCompiler: true,
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/localhost/:path*", destination: `${API_URL}/:path*` },
    ];
  },
};

export default nextConfig;
