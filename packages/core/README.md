# @svgenio/core

Core SVG to React component conversion library for Node.js and browser environments.

## Installation

```bash
npm install @svgenio/core
```

## Usage

### Basic Conversion

```typescript
import { svgenio } from '@svgenio/core';

// Convert a single SVG file
const result = svgenio.convert('path/to/icon.svg', {
  typescript: true,
  componentName: 'MyIcon'
});

console.log(result.componentName); // 'MyIcon'
console.log(result.code); // Generated React component code
```

### Batch Processing

```typescript
import { svgenio } from '@svgenio/core';

// Process multiple SVG files
svgenio.batch('path/to/svg/folder', {
  typescript: true,
  outDir: './output',
  barrelFile: true
});
```

## API Reference

### `convert(filePath: string, options?: ConvertOptions)`

Converts a single SVG file to a React component.

**Parameters:**
- `filePath`: Path to the SVG file
- `options`: Conversion options
  - `typescript?: boolean`: Generate TypeScript component (default: true)
  - `componentName?: string`: Custom component name

**Returns:**
- `componentName`: The generated component name
- `code`: The generated React component code

### `batch(folderPath: string, options?: BatchOptions)`

Processes multiple SVG files in a folder.

**Parameters:**
- `folderPath`: Path to the folder containing SVG files
- `options`: Batch processing options
  - `typescript?: boolean`: Generate TypeScript components (default: true)
  - `outDir?: string`: Output directory (default: same as input folder)
  - `barrelFile?: boolean`: Generate barrel file (default: false)

## Features

- 🎯 **Single SVG Conversion**: Convert individual SVG files to React components
- 📁 **Batch Processing**: Process entire folders of SVG files at once
- 🔧 **TypeScript Support**: Generate TypeScript components with proper type definitions
- 📦 **Barrel Exports**: Automatically generate index files for easy imports
- 🎨 **React Optimized**: Transform SVG attributes for React compatibility (e.g., `class` → `className`)

## Error Handling

The library provides detailed error messages for common issues:

- File not found
- Invalid file type (non-SVG files)
- Empty SVG files
- Folder not found
- No SVG files in folder

## License

MIT - see [LICENSE](../../LICENSE) file for details. 