const path = require("path");

// define child rescript
module.exports = config => {
  //config.target = "electron-renderer";
  config.resolve = {
    alias: {
      "@project-app": path.resolve(__dirname),
      "@project-src": path.resolve(__dirname, "/src")
    }
  };

  return config;
};
