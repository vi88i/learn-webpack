const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    const isDevMode = argv.mode === "development";

    return {
        mode: isDevMode ? "development" : "production",
        watch: isDevMode,
        entry: {
            main: "./src/index.js"
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].bundle.js",
            clean: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.template',
                title: "Code splitting"
            })
        ]
    };
};
