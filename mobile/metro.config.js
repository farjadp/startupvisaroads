// The app reads two things from the website's repo instead of keeping copies:
// the brand tokens (design/tokens.json) and the route rules and figures
// (lib/fa/programmes.ts, lib/canada-suv.ts). Both are pure data / pure
// functions with no imports, so Metro only has to be allowed to watch them.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const repoRoot = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [path.join(repoRoot, 'design'), path.join(repoRoot, 'lib')];
config.resolver.nodeModulesPaths = [path.join(__dirname, 'node_modules')];

module.exports = config;
