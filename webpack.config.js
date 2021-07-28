var path = require("path");

module.exports = (_env, argv) => {
  const isProduction = argv.mode == "production";
  const config = {};
  if (!isProduction) {
    config.devtool = "source-map";
  }
  return {
    ...config,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: `mustache-wax.${isProduction ? "min.js" : "js"}`,
      library: "wax",
      libraryTarget: "umd",
      globalObject: "this",
    },
  };
};
