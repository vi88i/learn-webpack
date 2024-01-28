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

## Under the hood

- It is a **event-driven plugin-based compiler**
- A compilation process will have many stages. After each stage an event is emitted. Plugins can hook into the main compilation process by listening to these events and perform additional functionalities.

1. The **compiler** will find the configuration file. It will parse the configuration file and find the first entry point. Webpack creates a *chunk group* for each entry file.

2. The relative path in specificed in entry point is provided to the **resolver**, which will convert relative path to absolute path. And it will check if the file exists or not.

3. The resolver will send the absolute path to **module factory**. It creates a module object which contains information like id, file type, size, content of file etc. This module object is added to chunk group. Each module in chunk group is called as *chunk*.

4. The **parser** will parse the content of module and constructs an AST. This AST is used to find `require` or `import` statements.

If module A imports module B, then there is a directed edge from A to B. Directed Acyclic Graph (DAG) construction is initiated. For each new module discovered repeat step 1 - 4.
 
5. Once all the dependencies are parsed and added to dependency graph. *The modules in DAG are sorted in topological order*.

6. This order is used to bundle the modules in correct order.

7. Various plugins (minification, tree shaking etc.) can now be applied. Suitable transpiler is picked to convert the modules into *browser readable format*.

8. Same process is applied for each entry.

### What happens when something is loaded lazily? (Code splitting)

- When dynamic import is encountered, it indicates the start of new chunk group i.e., new dependency graph.

- Total number of bundles for each entry file = *initial chunk* + *non-initial chunks*

- *initial chunk* only contains those modules that are not lazily loaded.

- *non-initial chunks* are those chunks which get created when dynamic import is encounterec.
