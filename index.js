const fs = require("fs");
const path = require("path");
const crx = require("crx-util");
const extensionDir = path.join(__dirname, "extensions");

/**
 * Download a extension from Chrome/Edge web store and adapt to NW.js
 * @param {String} urlOrId Chrome/Edge extension url or id
 * @param {"chrome" | "edge"} source "chrome" or "edge"
 */
function install(urlOrId, source = "") {
  if (urlOrId.startsWith("https://")) {
    const parser = crx.downloader.parseURL(urlOrId);
    urlOrId = parser.extensionId;
    source = parser.source;
  }
  if (urlOrId && (source === "chrome" || source === "edge")) {
    return installById(urlOrId, source);
  }
  return Promise.reject("Invalid parameters");
}

function installById(extensionId, source) {
  console.log(`Downloading extension from ${source} web store...`);

  return crx.downloadById(extensionId, source, extensionDir).then((res) => {
    if (res.result) {
      console.log(" - Downloaded!");
      const { output } = res;

      const manifestFile = path.join(output, "manifest.json");
      const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
      const { name, version } = manifest;
      console.log(` - Name: ${name}`);
      console.log(` - Version: ${version}`);
      console.log(" - Modify manifest.json");
      manifest.extension_id = extensionId;
      manifest.extension_source = source;
      if (!/all_urls/.test(manifest.permissions.join(""))) {
        manifest.permissions.push("<all_urls>");
      }
      fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), "utf8");

      console.log(" - Rename package.json");
      const pkgFile = path.join(output, "package.json");
      if (fs.existsSync(pkgFile)) {
        fs.renameSync(pkgFile, path.join(output, "_package.json"));
      }

      const dirName = name.toLowerCase().replace(/ /g, "-");
      const dest = path.resolve(output, `../${dirName}`);
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      fs.renameSync(output, dest);

      console.log(" - Extension successfully installed!");
      console.log(` - Path: "./node_modules/nwjs-crx/extensions/${dirName}"`);
    } else {
      console.log(" - Install failed!", res.error);
      return Promise.reject(res.error);
    }
  });
}

/**
 * List installed extensions
 */
function list() {
  if (fs.existsSync(extensionDir)) {
    return fs
      .readdirSync(extensionDir)
      .map((dirName) => {
        const dir = path.join(extensionDir, dirName);
        if (fs.statSync(dir).isDirectory()) {
          const manifestFile = path.join(dir, "manifest.json");
          if (fs.existsSync(manifestFile)) {
            const manifest = fs.readJsonSync(manifestFile);
            return {
              name: manifest.name,
              version: manifest.version,
              id: manifest.extension_id,
              source: manifest.extension_source,
              path: dir,
            };
          }
        }
        return null;
      })
      .filter((item) => !!item);
  }
  return [];
}

module.exports = {
  install,
  list,
};
