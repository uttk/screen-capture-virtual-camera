const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: isDev ? "development" : "production",
  devtool: isDev ? "inline-source-map" : false,

  entry: path.resolve(__dirname, "./src/index.ts"),

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    clean: true,
  },

  resolve: {
    extensions: [".js", ".ts"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "ts",
              minify: !isDev,
              target: "es2015",
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./public/manifest.json", to: "manifest.json" }],
    }),
  ],
};
