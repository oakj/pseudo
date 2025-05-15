module.exports = {
  expo: {
    name: "pseudo",
    slug: "pseudo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pseudo",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    
    ios: {
      bundleIdentifier: "com.labandboston.pseudo",
      supportsTablet: true
    },
    
    android: {
      package: "com.labandboston.pseudo",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      compileSdkVersion: 34,
      targetSdkVersion: 34,
      buildToolsVersion: "34.0.0"
    },
    
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf"
          ]
        }
      ]
    ],
    
    experiments: {
      typedRoutes: true
    },
     
    extra: {
      router: {},
      eas: {
        projectId: "2e095dd2-7bb7-4950-bd99-f87471fadd98"
      },
      supabaseUrl: process.env.REACT_NATIVE_SUPABASE_URL,
      supabaseAnonKey: process.env.REACT_NATIVE_SUPABASE_ANON_KEY,
      supabaseTestUserId: process.env.REACT_NATIVE_SUPABASE_TEST_USER_ID
    },
    
    owner: "oakj28"
  }
}; 