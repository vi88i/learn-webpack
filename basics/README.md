# Setup for basic webpack

- Install node v18
- Need a browser which is ES5 compliant (most browsers are compliant except IE8 and below)

```bash
mkdir basics
cd basics
npm init -y
npm install webpack webpack-cli --save-dev
```

# Topics

- Using template html to create main `index.html` by using `html-webpack-plugin`
- Inlining critical CSS using `style-loader` and `css-loader` of only certain files
- Extracting CSS into separate file and loading it using `<link>`
- Using copy plugin to copy files as it is (images, config files etc.)
- Use watch feature to recreate the bundles when dev code changes
- How to load `.svg` as base64 data URI using webpack

# How to run basics?

```bash
# go to server folder (basic http server to serve static files)
npm i
node index.js

# go to basics folder
npm i
npm run dev
# npm run prod
```