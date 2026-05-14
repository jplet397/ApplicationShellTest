const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const production = process.env.NODE_ENV === "production";

const about = {
    entry: "./src/about/main",
    output: {
        publicPath: "http://localhost:50002/",
        uniqueName: 'about',
        path: path.resolve(__dirname, 'dist/about'),
        filename: '[name].js',
        clean: true,
    },
    mode: production ? "production" : "development",
    devtool: production ? "source-map" : "eval-source-map",
    devServer: {
        watchFiles: ['./src/about/**/*', "main.html"],
        static: './dist/about',
        port: 50002,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new ModuleFederationPlugin({
            name: "about",
            library: {type: "var", name: "about"},
            filename: "remoteEntry.js",
            exposes: {
                "./component": "./src/about/component"
            },
            shared: {
                "rxjs": {},
            }
        }),
        new HtmlWebpackPlugin({
            template: "./src/about/index.html"
        }),
    ]
};

module.exports = about;