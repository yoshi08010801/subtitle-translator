// next.config.js
const nextConfig = {
    webpack: (config) => {
      config.experiments = {
        topLevelAwait: true,
        layers: true,
      };
  
      // 🔽 他の externals を壊さないよう配列形式で追記
      config.externals = config.externals || [];
      config.externals.push({
        '@ffmpeg/core': 'null',
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  