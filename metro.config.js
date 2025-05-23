const { getDefaultConfig } = require('expo/metro-config');

const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

module.exports = (() => {
const config = getDefaultConfig(__dirname);

// Firebase compatibility fixes for Expo SDK 53
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

return wrapWithReanimatedMetroConfig(config);
})();