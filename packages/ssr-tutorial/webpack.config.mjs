import path from "path"
import nodeExternals from "webpack-node-externals"

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig[] */
export default [
  {
    entry: {
      main: "./src/client.tsx"
    },
    output: {
      path: path.join(import.meta.dirname, "/dist"),
      filename: "[name].js"
    },
    resolve: {
      extensions: [".ts", ".tsx", "..."]
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        }
      ]
    }
  },
  {
    entry: {
      server: "./src/server.ts"
    },
    experiments: {
      outputModule: true
    },
    output: {
      path: path.join(import.meta.dirname, "/dist"),
      filename: "[name].js",
      library: {
        type: "module"
      }
    },
    resolve: {
      extensions: [".ts", ".tsx", "..."]
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        },
        {
          test: /\.html$/,
          type: "asset/source"
        }
      ]
    },
    target: "node",
    externals: [nodeExternals()]
  }
]
