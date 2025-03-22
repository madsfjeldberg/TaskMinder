export default {
  name: "TaskMinder",
  slug: "TaskMinder",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "taskminder",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  owner: "fjeldberg",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.fjeldberg.TaskMinder",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "This app needs access to location to show your position on the map.",
      NSLocationAlwaysUsageDescription:
        "This app needs access to location to show your position on the map.",
    },
  },
  android: {
    package: "com.fjeldberg.TaskMinder",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  extra: {
    eas: {
      projectId: "df8518f0-2cdb-4277-bbb2-062295af2c9e",
    },
  },
  secrets: {
    FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
};
