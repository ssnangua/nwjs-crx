# nwjs-crx

Install Chrome/Edge extension for NW.js.

## Install

```bash
npm install nwjs-crx
```

## Usage

1. Install extension:
```bash
nwjs-crx install olofadcdnkkjdfgjcmjaadnlehnnihnl edge
```
2. Add extension path to `package.json` of your NW.js app:
```json
  "chromium-args": "--load-extension='./node_modules/nwjs-crx/extensions/vue.js-devtools'"
```

### Install extension

#### CLI

```bash
# Install by extension url:
nwjs-crx install $url

# Install by extension id and source ("chrome" or "edge"):
nwjs-crx install $extensionId $source

# List installed extensions:
nwjs-crx list
```

#### Programming

```javascript
const nwCrx = require("nwjs-crx");

// Install by extension url
nwCrx.install(
  "https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl"
);

// Install by extension id and source ("chrome" or "edge")
nwCrx.install("olofadcdnkkjdfgjcmjaadnlehnnihnl", "edge");

// List installed extensions
console.log(nwCrx.list());
```

### Use extension

Add extension path to `package.json` of your NW.js app:

```json
  "chromium-args": "--load-extension='extension1,extension2'"
```
