const path = require("path");

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devServer: (devServerConfig) => {
    devServerConfig.host = '0.0.0.0';
    devServerConfig.port = 5000;
    devServerConfig.allowedHosts = 'all';
    return devServerConfig;
  },
};
