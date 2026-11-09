// The app reads two things from the website's repo instead of keeping copies:
// the brand tokens (design/tokens.json) and the route rules and figures
// (lib/fa/programmes.ts, lib/canada-suv.ts, lib/express-entry). The Express
// Entry engine reads its grid from config/*.json, so Metro watches config/ too.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const repoRoot = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [path.join(repoRoot, 'design'), path.join(repoRoot, 'lib'), path.join(repoRoot, 'config')];
config.resolver.nodeModulesPaths = [path.join(__dirname, 'node_modules')];

module.exports = config;
