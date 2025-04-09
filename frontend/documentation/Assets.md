# Asset Management

This document outlines best practices and guidelines for handling assets in our React Native application.

## Image Assets

### Avatar Images

When working with avatar images in our application, particularly with React Native Restyle (RNR) components:

#### Recommended Format
- Use PNG or JPG formats for avatar images
- Avoid SVG files for Avatar components
- Maintain consistent dimensions (e.g., 256x256px) for all avatar assets

#### Rationale
1. **Native Support**: PNG/JPG formats are natively supported by React Native's Image component
2. **Performance**: Direct rendering without additional parsing
3. **Compatibility**: Better cross-platform consistency
4. **Simplicity**: No additional dependencies required

#### Implementation
```typescript
const DEFAULT_AVATARS = [
  { id: "1", url: require("../assets/avatars/1.png") },
  // ... more avatars
]
```

### SVG Usage

While SVGs are not recommended for Avatar components, they can be used in other parts of the application with proper setup:

#### Requirements
1. Install required dependencies:
   ```bash
   npm install react-native-svg
   npm install --dev react-native-svg-transformer
   ```

2. Configure metro.config.js for SVG support
3. Add appropriate type definitions

#### When to Use SVG
- Icons
- Illustrations
- Decorative elements
- Components requiring dynamic colors
- Elements that need perfect scaling

## Asset Organization

### Directory Structure
```
frontend/
├── assets/
│   ├── avatars/
│   │   ├── 1.png
│   │   ├── 2.png
│   │   └── ...
│   ├── icons/
│   │   └── ...
│   └── images/
│       └── ...
```

### Naming Conventions
- Use lowercase letters
- Use numbers or descriptive names
- Use hyphens for spaces
- Include dimensions in filename if relevant

Example:
```
avatar-default-256x256.png
icon-settings-24x24.svg
```

## Best Practices

1. **Optimization**
   - Compress images before adding to the project
   - Use appropriate image dimensions for the intended display size
   - Consider using different sizes for different screen densities

2. **Version Control**
   - Track all assets in version control
   - Use Git LFS for large binary files if needed

3. **Documentation**
   - Document any special requirements or usage patterns
   - Include source information for licensed assets
   - Maintain a catalog of available assets

## Common Issues and Solutions

1. **Avatar Images Not Displaying**
   - Verify file format (use PNG/JPG)
   - Check file path in require statement
   - Ensure proper dimensions
   - Verify file exists in assets directory

2. **SVG Related Issues**
   - SVGs require additional setup and dependencies
   - Consider converting to PNG for Avatar components
   - Use react-native-svg for other SVG needs

## Future Considerations

1. **Asset Preloading**
   - Implement asset preloading for critical images
   - Consider lazy loading for non-critical assets

2. **Dynamic Assets**
   - Plan for CDN integration
   - Consider caching strategies

3. **Accessibility**
   - Include proper alt text for images
   - Maintain sufficient contrast ratios
   - Consider reduced motion preferences

