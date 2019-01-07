const path = require("path");

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    proxy: {
      "/services/*": {
        target: "http://abakus.spacemaker.ai",
        changeOrigin: true
      },
      "/validation-service": {
        target: "http://abakus.spacemaker.ai",
        // target: "http://localhost:5001",
        changeOrigin: true
      },
      "/analysis-service": {
        // target: "http://abakus.spacemaker.ai",
        target: "http://localhost:5002",
        changeOrigin: true,
        pathRewrite: {
          "/analysis-service": ""
        }
      }
    }
  }
};
