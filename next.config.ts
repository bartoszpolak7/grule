import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler sprawdza kod i automatyzuje memoizację
  // EKSPERYMENTALY FEAT, MOŻNA WYŁĄCZYĆ JAK COŚ
  reactCompiler: true,

  // standalone przeznaczony do minimalnego buildu
  // przeznaczony na Docker
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
      },
    ],
  },
};

export default nextConfig;
