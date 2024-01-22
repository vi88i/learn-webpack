const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
    const isDevMode = argv.mode === "development";

    return {
        mode: isDevMode ? "development" : "production",
        watch: isDevMode,
        entry: "./src/index.js",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "main.js",
            clean: true
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    minify: TerserPlugin.uglifyJsMinify
                })
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.template',
                title: "Tree shaking"
            })
        ]
    };
};
