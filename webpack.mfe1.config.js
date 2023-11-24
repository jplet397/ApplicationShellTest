const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mfe1 =  {
    entry: "./src/mfe1/main",
    output: {
        clean: true,
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/mfe1'),
    },
    mode: "development",
    devServer: {
        watchFiles: ['./src/mfe1/**/*', "main.html"],
        static: './dist/mfe1',
        port: 50001,
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
        extensions: [ '.ts', '.js' ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new ModuleFederationPlugin({
            name: "mfe1",
            library: { type: "var", name: "mfe1" },
            filename: "remoteEntry.js",
            exposes: {
                "./component": "./src/mfe1/component"
            },
            shared: {
                "rxjs": {},
            }
        }),
        new HtmlWebpackPlugin({
            template: "./src/mfe1/index.html"
        }),
    ]
};

module.exports = mfe1;