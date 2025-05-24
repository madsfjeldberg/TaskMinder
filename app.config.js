export default {
  name: "TaskMinder",
  slug: "TaskMinder",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/images/web/apple-touch-icon.png",
  scheme: "taskminder",
  userInterfaceStyle: "automatic",
  owner: "fjeldberg",
  ios: {
    icon: "./assets/images/ios/AppIcon~ios-marketing.png",
    supportsTablet: true,
    bundleIdentifier: "com.fjeldberg.TaskMinder",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "This app needs access to location to show your position on the map.",
      NSLocationAlwaysUsageDescription:
        "This app needs access to location to show your position on the map.",
    },
    modularHeaders: true, // This sets use_modular_headers! globally
    buildConfiguration: {
      extraPodfileProperties: [
        'use_frameworks! :linkage => :static'
      ]
    },
    podModuleConfig: {
      "FirebaseAuth": {
        modular_headers: true
      },
      "FirebaseCoreInternal": {
        modular_headers: true
      },
      "GoogleUtilities": {
        modular_headers: true
      }
    }
  },
  android: {
    package: "com.fjeldberg.TaskMinder",
    icon: "./assets/images/android/play_store_512.png",
    adaptiveIcon: {
      foregroundImage: "./assets/images/android/res/mipmap-xxxhdpi/ic_launcher.png",
      backgroundColor: "#ffffff"
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/web/favicon.png",
    icons: [
      {
        src: "./assets/images/web/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./assets/images/web/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "./assets/images/web/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "./assets/images/web/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  },
  expo: {
    "jsEngine": "hermes",
    "bridgeless": false,
    "extra": {
      "eas": {
        "projectId": "1f5c8d46-45d9-46a7-8289-bcc62be298c5"
      }
    }
  },
  plugins: [
    [
    "expo-location",
    {
      "locationAlwaysAndWhenInUserPermission": "Allow TaskMinder to use your location even when you are not using the app",
    },
    ],
    "expo-router",
    "expo-secure-store",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static"
        }
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  extra: {
    eas: {
      "projectId": "1f5c8d46-45d9-46a7-8289-bcc62be298c5"
    }
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
