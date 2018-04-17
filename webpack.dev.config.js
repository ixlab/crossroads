const path = require("path");
const webpack = require("webpack");

module.exports = {
   watch: true,

   devtool: "source-map",

   entry: ["babel-polyfill", "./app/index.js"],

   output: {
      path: path.resolve(__dirname, "public/app"),
      filename: "bundle.js",
      publicPath: "/public/"
   },

   resolve: {
      root: path.resolve(__dirname, "app"),
      alias: {
         "trips-data": "trips-data",
         utils: "utils",
         data: "data",
         components: "components",
         store: "redux/store.js",
         reducers: "redux/reducers",
         actions: "redux/actions",
         routes: "routes.js",
         "scss-variables": "styles/base/_variables.scss",
         stylesheet: "styles/stylesheet.scss"
      },
      extensions: ["", ".js", ".jsx"]
   },

   plugins: [new webpack.OldWatchingPlugin()],

   module: {
      loaders: [
         {
            test: /\.css/,
            loader: "style!css!"
         },
         {
            test: /\.scss/,
            loader:
               "style!css!sass?includePaths[]=" +
               path.resolve(__dirname, "./node_modules")
         },
         {
            test: /\.woff[0-9]?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
         },
         {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
         },
         {
            loader: "babel-loader",
            test: /\.jsx?$/,
            exclude: /(node_modules)/
         },
         {
            test: /\.(png|jpg)$/,
            loader: "url"
         },
         {
            test: /\.(json)$/,
            loader: "json"
         }
      ]
   }
};
