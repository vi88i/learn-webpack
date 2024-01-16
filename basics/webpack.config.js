const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    const isDevMode = argv.mode === "development";

    return {
        mode: isDevMode ? "development" : "production",
        watch: isDevMode,
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
                },
                {
                    // if you find sth like import xyz from "abc.svg" 
                    // then copy that resource to output dir (dist) with random guid (random-guid.svg)
                    // assign the name of copied resoure to xyz, xyz = "random-guid.svg"
                    test: /\.svg$/i,
                    type: "asset/resource" 
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
            new CopyPlugin({
                // sometimes there are assets which can be dynamically requested using fetch
                // webpack cannot bundle the resources requested using ajax / fetch / axios
                patterns: [
                    // copies all files from 'src/constants/endpoints' to 'dist/endpoints'
                    { from: path.resolve(__dirname, "src/constants/endpoints"), to: "endpoints/" },
                    // copies all files from 'src/static/images' to 'dist/images
                    // then in html <img src="/images/[name].[ext]"> will load image from dist/image 
                    { from: path.resolve(__dirname, "src/static/images"), to: "images/" }
                ]
            }),
            new BundleAnalyzerPlugin()
        ]
    };
};
