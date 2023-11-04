const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let production = process.env.NODE_ENV === "production";
let config = {
    entry: {
        index: './src/index.ts',
    },
    output: {
        clean: true,
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    // devtool is used for source mapping. (https://webpack.js.org/configuration/devtool/)
    devtool: "eval-source-map",
    mode: "development",
    devServer: {
        watchFiles: ['./src/**/*', "index.html"],
        static: './dist',
        // This is used to proxy the request to a different server. Use when server needed
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:5000',
        //         pathRewrite: {'^/api' : ''} // remove /api from the url
        //     }
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    // This is used to define loaders.
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: ["html-loader"]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader, // This will create a new file for the css
                    "css-loader", // This will resolve the imports in css files
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [["postcss-preset-env", {}] // This will add vendor prefixes to css (for browser compatibility)
                                ]
                            }
                        }
                    },
                    "sass-loader" // This will convert sass to css
                ] // Order is important! Loaders are processed from right to left.
            },
            // smaller than 4kb will be inlined as base64-encoded string, otherwise file-loader is used
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 50 * 1024 // 4kb
                    }
                },
                generator: {
                    filename: 'images/[name][hash][ext]'
                }
            },
        ],
    },
    plugins: [
        // This plugin is used to create a html file in dist folder.
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
        }),
        // This plugin is used to create a css file in dist folder.
        new MiniCssExtractPlugin({
            filename: "bundle.css",
        }),
        // new BundleAnalyzerPlugin()
    ],
}

if (production) {
    config.mode = "production";
    config.devtool = "source-map"; // This is used to create source map files.
}

module.exports = config;