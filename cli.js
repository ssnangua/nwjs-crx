#!/usr/bin/env node

const crx = require("./");

const help = `Install Chrome/Edge extension for NW.js

# Install by extension url:
nwjs-crx install $url

# Install by extension id and source ("chrome" or "edge"):
nwjs-crx install $extensionId $source

# List installed extensions:
nwjs-crx list`;

const [cmd, urlOrId, source] = process.argv.splice(2);

if (cmd === "list") {
  console.log(crx.list());
} else if (cmd === "install") {
  crx.install(urlOrId, source);
} else {
  console.log(help);
}
