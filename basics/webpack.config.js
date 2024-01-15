const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },
    module: {
        rules: [
            /*
                Requirement:
                1. Inline CSS of index.js
                2. Any other CSS should be extracted into separate file and placed in dist/css/main.css
                   And then put a <link> for that file in index.html

                Ideally rules with same test pattern should be mutually exclusive in terms of
                files they load
            */
            {
                test: /\.css$/i,
                exclude: [
                    path.resolve(__dirname, "src/index.css")
                ],
                /*
                    - MiniCssExtractPlugin.loader will find all CSS files for each entry point
                    - For each entry point it will generate one css file having same name as
                      entry file name
                    - Concatenates all CSS of each entry into one file
                */
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                // this rule is used for inlining
                test: /\.css$/i,
                include: [
                    // We want to inline CSS of only index.js
                    path.resolve(__dirname, "src/index.css")
                ],
                /*
                    - Multiple loaders can be chained (L <- R)
                    - style-loader reads the .css file and injects it into <style></style>
                    - css-loader resolves @import, url() in .css files
                    - This approach is used mainly for inlining critical CSS
                */
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.template',
            title: "Basics",
            header: "Basics"
        }),
        new MiniCssExtractPlugin({
            // extracted CSS should be moved to dist/css/[name].css
            filename: "css/[name].css"
        }),
        new BundleAnalyzerPlugin()
    ]
};
