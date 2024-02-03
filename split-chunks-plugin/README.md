# SplitChunksPlugin

- It helps to break down large codebases into smaller chunks improving overall performance and speed (reducing bundle size).

- A `chunk` is code which will break apart from main bundle and form it's own file / bundle.

- It is available out-of-the-box in webpack with default configuration.

## Intuition

- Let's say we use route based loading of React components. In each bundle we would be importing `react`, `react-dom` and `react-router-dom`. What if extract `react`, `react-dom` and `react-router-dom` them into `react-bundle` and cache it on client side (updating react packages is less frequent). All the bundles re-use the same `react-bundle`.


## How it works?

- We can configure various parameters to control when a chunk should be created:

    - `chunks = all | intial | async`:
    1. `all`: All initial and non-intial modules will be selected for optimization. This is powerful because it means chunks can be shared between both statically and dynamically imported modules.
    2. `initial`: Only initial (statically imported) modules will be selected for optimization. Chunks shared between only statically imported modules.
    3. `async`: Only non-initial (dynamically imported) modules will be selected for optimization. Chunks shared between only dynamically imported modules.

    - `maxAsyncRequests`:
    Maximum number of parallel requests when lazily loading a bundle. Chunks won't be created if the limit is reached.

    - `maxInitialRequests`: 
    Maximum number of parallel requests when loading a entry point.

    - `minChunks`: Minimum number of times a module is shared for it to be considered for splitting.

    - `minSize`: Minimum number of bytes a bundle should reach for it to be considered for splitting.

    - `minSizeReduction`: If after splitting the main bundle size doesn't reduce by certain amount then don't split even if the bundle size > `minSize`

    - `enforceSizeThreshold`: Split all bundles on reaching certain amount of bytes (ignores `maxInitialRequests` and `maxAsyncRequests`)

    - `cacheGroups`: Do splitting of chunks at more granular level.

    - `name`: Name of split chunk

And many more.

## Examples

Suppose you want to extract `lodash` in a common bundle and re-use it across multiple bundles. Use bundle analysis tool to check if splitting is happening correctly.

```js
module.exports = {
    //...
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: "vendor",
                    chunks: "all",
                    enforece: true
                },
                common: {
                    test: /[\\/]node_modules[\\/](lodash)[\\/]/,
                    name: "common",
                    chunks: "all",
                    enforce: true // force split
                }
            }
        }
    }
};
```

