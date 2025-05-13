This document outlines the CSS styling guidelines.

# NativeWind
This application uses NativeWind (a React Native version of Tailwind CSS). This allows us to use NativeWind-based component libraries. For purposes of this application, we will be using `React Native Reusables`.

# Colors
Note: Transparency is 0% unless noted otherwise.

| Color | Color Code | Example | Notes |
|-------|------------|---------|-------|
| black | #18181B | <div style="width: 50px; height: 20px; background-color: #18181B; border: 1px solid white;"></div> | |
| white | #FFFFFF | <div style="width: 50px; height: 20px; background-color: #FFFFFF; border: 1px solid white;"></div> | |
| gray-soft | #E7E7E7 | <div style="width: 50px; height: 20px; background-color: #E7E7E7; border: 1px solid white;"></div> | |
| green-soft | #DDFFD6 | <div style="width: 50px; height: 20px; background-color: #DDFFD6; border: 1px solid white;"></div> | |
| green-hard | #2AB333 | <div style="width: 50px; height: 20px; background-color: #2AB333; border: 1px solid white;"></div> | |
| red-soft | #FFE3E3 | <div style="width: 50px; height: 20px; background-color: #FFE3E3; border: 1px solid white;"></div> | |
| red-hard | #FF4E4E | <div style="width: 50px; height: 20px; background-color: #FF4E4E; border: 1px solid white;"></div> | |
| orange-soft | #FFEBCB | <div style="width: 50px; height: 20px; background-color: #FFEBCB; border: 1px solid white;"></div> | |
| blue-soft | #D9D9FF | <div style="width: 50px; height: 20px; background-color: #D9D9FF; border: 1px solid white;"></div> | |


## Colors Setup and Configuration

Setup instructions:
1. Add the colors to `tailwind.config.js`
    - Reference: [tailwind.config.js (Line 19)](../pseudo/tailwind.config.js)
2. Use the color
    - Example: ```<View className="bg-green-soft">Hello, world!</View>```

# Typography
Base font-family: **Montserrat** with system fallback.

## Typography Setup and Configuration

Setup instructions:
1. Download and include Montserrat font in `pseudo/assets/fonts`
2. Import the font in `pseudo/app/_layout.tsx`
    - Reference: [app/_layout.tsx (Line 13)](../pseudo/app/_layout.tsx)
3. Configure the font in `tailwind.config.js`
    - Reference: [tailwind.config.js (Line 49-66)](../pseudo/tailwind.config.js)
4. Use the font
    - Example: ```<Text className="font-montserrat">Hello, world!</Text>```

## Font Weights
```
The variable font file will handle all font weights automatically, and you can still use Tailwind's font weight utilities like font-normal, font-medium, font-semibold, and font-bold without explicitly defining them in the config. Tailwind's default font weight scale will work with your variable font.
```

## Font Sizes
| Name | Size | Usage |
|------|------|-------|
| xxs | 10px | |
| xs | 12px | |
| sm | 14px | |
| base | 16px | |
| lg | 18px | |
| xl | 24px | |
| 2xl | 32px | |