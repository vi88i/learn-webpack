# Back when bundler wasn't a thing

- Let's say a webpage requires 20 huge script file to function as expected. We'll end up dropping 20 `<script>` tags in `index.html` in some specific order. 

- In HTTP1, there is limit of *6 concurrent connections per origin*. Imagine a browser loading 20 `<script>` using HTTP1 (LCP, FCP, TBT laughing in the corner xD)

- Also if one script depends on other, then depedent module should be loaded first i.e., we need to figure out the correct order of script loading. 

# Basic bundler

- The basic bundler just concatenated all the script file into one big script file. (LCP, FCP, TBT still laughing in the corner xD, web users trying to load the page using high speed 3G about to kill themselves for seeing the loader for a very long time xD)

- Concatenation is not straightforward. How do you handle name collisions? How do you handle dependencies? What if a particular user's usage pattern doesn't require certain parts of script? How do you handle big bundle size?

- Scoping issues can be solved using IIFEs


# What is a bundler?

- **It allows us to write JavaScript code in modular way which runs in browser**. It takes care of converting your modular code to another code form which can run in browser (browsers don't understand module system (WIP))

## How it works?

1. Provide one or more entry points
2. For each entry point find all dependencies (build dependency graph)
3. Package each entry file and its dependencies as a single bundle

# Module system

- Modules allows us to split code into multiple reusable components.
- Webpack considers everything (CSS, JS, JSON, images, fonts) as a module.

```js
// ECMAScript modules
import { cloneDeep } from "lodash";

export const fn = function() {};
export default fn;
```

```js
// CommonJS (Node.js)
const { cloneDeep } = require("lodash");

module.exports = {}
```

# Webpack core concepts

## Entry

- It indicates which module is the starting point to build the dependency graph.

```js
const path = require('path');

// webpack.config.json (should be placed at the root folder of your app)
module.exports = {
    entry: "./path/to/my/entry.js"
};
```

## Output

- It indicates where to put the emitted bundles.

```js
const path = require('path');

// bundle will be placed in ./dist/entry.js
module.exports = {
    entry: "./path/to/my/entry.js",
    output: {
        /*
            creates a folder called dist, relative to current directory of
            webpack.config.json

            __dirname is node env. variable which stores absolute path of
            currently executing script
        */
        path: path.resolve(__dirname, "dist"),
        filename: "entry.js"
    }
};
```

## Loaders

- Webpack only understands JavaScript and JSON out of the box. If you want to bundle other types of modules like CSS/LESS, images, fonts etc. we need to use loader.

- A loader reads the content of your file, converts it into valid module so that it can be added to your dependency graph.  

- `test` indicates the file extension that should be matched, `use` indicates the loader to be used load the matched modules.

```js
const path = require('path');

module.exports = {
    entry: "./path/to/my/entry.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "entry.js"
    },
    module: {
        rules: [
            /*
                Basically telling webpack,
                "If you find import xyz from "abc.txt" then use raw-loader to convert the
                asset into a module that can be added in dependency graph.
            */
            {
                test: /\.txt$/,
                use: "raw-loader"
            }
        ]
    }
};
```

## Plugins

- It is used to transform modules for optimization, injecting env. variables etc. **Basically extend webpack capabilities**.

```js
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./path/to/my/entry.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "entry.js"
    },
    module: {
        rules: [
            {
                test: /\.txt$/,
                use: "raw-loader"
            }
        ]
    },
    plugins: [
        /*
            injects the bundle names into a template html file,
            and creats a .html file that runs on browser
        */
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ]
};
```

## Mode

- Webpack can apply certain optimization out of the box, for certain modes.

- Modes: `production`, `development` or `none`

```js
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./path/to/my/entry.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "entry.js"
    },
    module: {
        rules: [
            {
                test: /\.txt$/,
                use: "raw-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ]
};
```