# SVGGenio CLI

A powerful CLI tool and npm package for converting SVG files to React components with TypeScript support.

## Features

- 🎯 **Single SVG Conversion**: Convert individual SVG files to React components
- 📁 **Batch Processing**: Process entire folders of SVG files at once
- 🔧 **TypeScript Support**: Generate TypeScript components with proper type definitions
- 📦 **Barrel Exports**: Automatically generate index files for easy imports
- 🎨 **React Optimized**: Transform SVG attributes for React compatibility (e.g., `class` → `className`)

## Installation

### CLI Tool

```bash
npm install -g @svgenio/cli
```

### NPM Package (for use in projects)

```bash
npm install @svgenio/core
```

## CLI Usage

### Convert a single SVG file

```bash
svgenio convert path/to/icon.svg
```

**Options:**
- `-o, --output <path>`: Specify output file path
- `-t, --typescript`: Generate TypeScript component (default: true)
- `-n, --name <name>`: Custom component name

**Examples:**
```bash
# Basic conversion
svgenio convert icon.svg

# Custom output path and name
svgenio convert icon.svg -o src/components/MyIcon.tsx -n MyIcon

# Generate JavaScript component
svgenio convert icon.svg --typescript false
```

### Batch process multiple SVG files

```bash
svgenio batch path/to/svg/folder
```

**Options:**
- `-o, --output <folder>`: Output folder (default: "./output")
- `-t, --typescript`: Generate TypeScript components (default: true)
- `-b, --barrel`: Generate barrel file (index.ts) (default: false)

**Examples:**
```bash
# Basic batch conversion
svgenio batch icons/

# Custom output folder with barrel file
svgenio batch icons/ -o src/components/icons --barrel

# Generate JavaScript components
svgenio batch icons/ --typescript false
```

## NPM Package Usage

### Basic Usage

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

### API Reference

#### `convert(filePath: string, options?: ConvertOptions)`

Converts a single SVG file to a React component.

**Parameters:**
- `filePath`: Path to the SVG file
- `options`: Conversion options
  - `typescript?: boolean`: Generate TypeScript component (default: true)
  - `componentName?: string`: Custom component name

**Returns:**
- `componentName`: The generated component name
- `code`: The generated React component code

#### `batch(folderPath: string, options?: BatchOptions)`

Processes multiple SVG files in a folder.

**Parameters:**
- `folderPath`: Path to the folder containing SVG files
- `options`: Batch processing options
  - `typescript?: boolean`: Generate TypeScript components (default: true)
  - `outDir?: string`: Output directory (default: same as input folder)
  - `barrelFile?: boolean`: Generate barrel file (default: false)

## Development

### Project Structure

```
svgenio-cli/
├── packages/
│   ├── core/          # Core conversion library
│   └── cli/           # CLI tool
├── test/              # Test SVG files
└── package.json       # Root package.json (monorepo)
```

### Building

```bash
# Build all packages
npm run build

# Build individual packages
cd packages/core && npm run build
cd packages/cli && npm run build
```

### Development Mode

```bash
# Watch mode for development
npm run dev
```

## License

MIT - see [LICENSE](LICENSE) file for details. 