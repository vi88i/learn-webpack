# Code splitting

- This feature of webpack allows in splitting code into multiple bundles and load them in demand or in parallel.

- If code splitting is used along with resource prioritization technique (`prefetch` or `preload`), it can significantly boost the load time on client side.

## Code splitting based on entry point

```js
// home.js
import { isNumber, cloneDeep } from "lodash-es";

console.log(isNumber("hello"));
console.log(cloneDeep({ a: 1 }));
```

```js
// about.js
import { isArray, cloneDeep } from "lodash-es";

console.log(isArray([]));
console.log(cloneDeep({ a: 1 }));
```

```js
// webpack.config.js
{
    entry: {
        home: "./src/home.js",
        about: "./src/about.js" 
    },
    output: {
        filename: "[name].bundle.js"
    }
}
```

- For small scale application this fine. But for huge projects this is very inefficient. 

### Drawbacks

- Lot of manual work
- Modules are duplicated (if same module is used in different bundle, then each bundle will the copy of module)

## Code splitting based on entry point + Dedpulication

- Check split-chunks-plugin folder

## Code splitting based on dynamic `import`

- Separate chunk group is created for each dynamically imported modules.

```js
// report.js

// we don't have to load pdfGenerate bundle in the initial load, because user may not want to generate pdf
// right away

const pdfGenerate = null;

const handleClick = async () => {
    showLoader();

    /*
        By default webpack gives unique random guid for non-initial chunks
        webpackChunkName: "[name]" will override that
        
        webpackPrefetch: Use this if any module is required in future, when idle it will download.
        Prefetch is just a resource hint i.e., browser will download only if network activity is less.
        When there is high network activity prefetch is ignored 

        webpackPreload: Use this if any module is required in the current navigation (current page).
        Preloads are not ignored by browser, it has to create a parallel request to fetch the resource.

        webpackChunkName, webpackPrefetch, webpackPreload are known as magic comments.
    */
    if (!pdfGenerate) {
        const module = await import(

            /* webpackChunkName: "pdfGenerate" */
            /* webpackPrefetch: true */
            "./pdfGenerate"
        )

        pdfGenerate = module.default;
    }

    pdfGenerate.downloadPage();
}

const Report = () => {
    <div onClick={handleClick}>Create PDF</div>
};
```

```js
// pdfGenerate.js
// assume this is hevay bundle

const downloadPage = () => {};

export default {
    downloadPage
};
```

## React route based code splitting

- React `lazy` function is used for lazily loading the components based on route. 
- "react-router-dom" is usually used in react for this purpose.
