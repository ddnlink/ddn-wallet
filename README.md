# DDNwallet 
Based on [electron](https://electronjs.org/)

##### Build cross platform desktop apps with JavaScript, HTML, and CSS

### clone from dev branch
features:
 - 账户，交易
 - 转账
 - 投票，注册受托人，锻造

<br/>

## Install

* **Note: requires a node version >= 7 and an npm version >= 4.**

First, clone the repo via git:

```bash
git clone http://git.ebookchain.net/ddn/ddnwallet.git
```

And then install dependencies with yarn/npm.

```bash
$ cd ddn-wallet
$ yarn or npm install
```

## Run

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:


```bash
$ npm start                 # Run in browser only
$ npm run dev               # Run in electron and load with dev (http://localhost:8000)
$ npm run electron-quick    # Run in electron and load with build pages
```


## build pages
```bash
$ npm run build
```

## Packaging

To package apps for the local platform:

```bash
$ npm run package           # package with current System
$ npm run package-quick     # package with built pages , 开发时用，省去重新编译的时间
$ npm run pack-win32        # package with windows 32bit
```

To package apps for all platforms:

First, refer to [Multi Platform Build](https://www.electron.build/multi-platform-build) for dependencies.

Then,
```bash
$ npm run package-all
```

To package apps with options:

```bash
$ npm run package -- --[option]
```

To run End-to-End Test

```bash
$ npm run build
$ npm run test-e2e
```

:bulb: You can debug your production build with devtools by simply setting the `DEBUG_PROD` env variable:
```bash
DEBUG_PROD=true npm run package
```

