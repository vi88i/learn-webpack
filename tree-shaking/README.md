# Tree shaking

- As of 2018, HTTP archive says median transfer size of JS bundle is 350KB (before decompress)!
- Goal is always to ship minimal code as possible (main thread is blocked when parsing JavaScript)
- Tree shaking is a form of **dead code elimination**

> *You can imagine your application as a tree. The source code and libraries you actually use represent the green, living leaves of the tree. Dead code represents the brown, dead leaves of the tree that are consumed by autumn. In order to get rid of the dead leaves, you have to shake the tree, causing them to fall* - wepack3

Basically if webpack finds something that is imported but not used (dead code) it will "tree-shake" it.

## ESM are static in nature

### CommonJS

- CommonJS used `require` for importing modules.
- CommonJS `require` is dynamic in nature. For example:

```js
if (someCondition) {
    require("./xyz");
} else if (someCondition) {
    require("./abc");
}
```

- The problem with above approach is that when bundling the code it is difficult to evaluate which all modules will be definitely be required.

### ESM (ECMAScript Modules)

- ESM use `import` for importing modules.
- ESM `import` is static in nature. For example:

```js
if (someCondition) {
    // ERROR: An import declaration can only be used at the top level of a module
    import xyz fomr "xyz";
}
```

- When bundling the modules, it is more easier to identify modules that are definitely used when compared to CJS modules.

NOTE: It is still possible to `import` modules dynamically in ESM but using dynamic import i.e., `import() -> Promise`


## Impure functions

```js
/*
    fn is pure
    - Doesn't read any variable outside of its scope
    - Doesn't alter any variable outside of its scope or its input
    - Does the computation soley based on inputs provided
    - Creates new variables soley based on inputs provided
    - We'll get the same result everytime, in any scope
*/
const fn = (x) => {
    return x * x;
};

/*
    gn is impure
    - Alters input variables
    - Reads variables outside of its scope
    - Alters the input
    - It is not guaranteed to give the same result
*/

const gn = (x) => {
    x = x + 5 + window.foo.x;
    window.foo.x += 6;
};
```

> *Modules with side effects cannot be 'shaken' safely, even if they're completely unreachable.*

- Having loads of impure functions / side effects will provide less opportunity to eliminate dead code.

#### Why?

```js
/* 
    no side effects can safely be removed, if no other modules imports it
*/
export const name = "vighnesh";

/*
    It can have side effect. What if getName() does some important stuff like initializing someting in global scope?
    Even if 'name' is not imported in any module, removing 'name' from final bundle is dangerous without having full knowledge.
*/
export const name = getName();
```

## Identifying opportunities to shake trees

```js
/*
    utils has sqaure, cube, floor, ceil, pow
    This kind of import will get all the functions
    But we're using only one function from utils
    Now imagine a big utils file with thousands of functions!
*/
import utils from "./utils";

console.log(utils.square(2));
```

```js
// even if you only import one function, it will still import all other functions
// if all optimizations are disabled
import { square } from "./utils";

console.log(square(2));
```


## How to find unused exports using webpack (in development mode)?

In `webpack.config.js`, add the following:

```js
{
    optimization: {
        // tells webpack to find used exports for each module
        // dead code elimination will benefit from this config
        usedExports: true
    }
}
```

On adding the above to `webpack.config.js`, re-run the webpack build. You'll find `unused harmanoy export <function name>` in the bundle, if there are any unused export.

## How to enable tree-shaking using webpack?

- Tree-shaking cannot be enabled in `development` mode
- Tree-shaking is enabled by default in `production` mode
- Webpack uses `terser-webpack-plugin` for minification (tree shaking is done during this phase)
- This plugin also remove comments from code by default
- NOTE: Important to thing to remember is that, we should make sure none of the plugins are converting ESM to CJS (`@babel/presets-env` has some issues)

### How to explicitly enable tree-shaking?

```js
{
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
}
```


## What if you don't want to tree-shake a module?

```json
// in package.json
{
    "sideEffects": ["./src/colors.js"]
}
```

## Tree-shaking tips

```js
// Always try to write pure modules / functions using ESM

// always try to use ESM modules
import _ from "lodash-es";

// import only the required things
import { cloneDeep } from "lodash-es";

// Ditch default imports and prefer namespace imports
// On tree shaking only cloneDeep and isNumber will be included in bundle
import * as _ from "lodash-es";
_.cloneDeep({ a: 1 })
_.isNumber(2)
```
