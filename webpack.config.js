const { dependencies } = require('./package.json');

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { ModuleFederationPlugin } = require('webpack').container;
const TerserPlugin = require('terser-webpack-plugin');

let production = process.env.NODE_ENV === "production";
let config = {
    entry: {
        index: './src/shell/index.ts',
        // about: './src/features/about-module/about.ts',
        contact: './src/features/contact-module/contact.ts',
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
        port: 50000,
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
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
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
                ]
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
            template: './src/shell/index.html',
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'about.html',
        //     template: './src/features/about-module/about.html',
        // }),
        new HtmlWebpackPlugin({
            filename: 'contact.html',
            template: './src/features/contact-module/contact.html',
        }),
        // This plugin is used to create a css file in dist folder.
        new MiniCssExtractPlugin({
            filename: "bundle.css",
        }),
        // This plug in used to configure webpack module federation.
        new ModuleFederationPlugin({
            name: "ApplicationShell",
            remoteType: 'script',
            library: { type: "var", name: "ApplicationShell" },
            remotes: {
                mfe1: "mfe1@http://localhost:50001/remoteEntry.js",
                about: "about@http://localhost:50002/remoteEntry.js",
            },
            shared: {
                ...dependencies,
                "rxjs": {},
            }
        }),
        // This plugin is used to analyze the bundle size. This does not need to run all the time.
        // new BundleAnalyzerPlugin()
    ],
}

if (production) {
    config.mode = "production";
    config.devtool = "source-map"; // This is used to create source map files.
}

module.exports = config;