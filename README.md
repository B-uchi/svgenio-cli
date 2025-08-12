# SVGGenio CLI

A powerful CLI tool and npm packages for converting SVG files to React components with TypeScript support. Includes both server-side and client-side libraries.

## Features

- 🎯 **Single SVG Conversion**: Convert individual SVG files to React components
- 📁 **Batch Processing**: Process entire folders of SVG files at once
- 🔧 **TypeScript Support**: Generate TypeScript components with proper type definitions
- 📦 **Barrel Exports**: Automatically generate index files for easy imports
- 🎨 **React Optimized**: Transform SVG attributes for React compatibility (e.g., `class` → `className`)
- 🌐 **Client-Side Support**: Browser-safe library for React/Next.js applications
- 📁 **Multiple Input Types**: Support for string, Buffer, File, and Blob inputs
- 🖱️ **Drag & Drop Ready**: Built-in helpers for file input and drag-and-drop events

## Packages

### `@svgenio/cli` - Command Line Interface
The CLI tool for batch processing SVG files from the command line.

### `@svgenio/core` - Server-Side Library
Core conversion library for Node.js environments with file system access.

### `@svgenio/client` - Client-Side Library
Browser-safe library for React/Next.js applications without Node.js dependencies.

## Installation

### CLI Tool

```bash
npm install -g @svgenio/cli
```

### Server-Side Package (Node.js)

```bash
npm install @svgenio/core
```

### Client-Side Package (Browser/React)

```bash
npm install @svgenio/client
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

## Server-Side Package Usage (`@svgenio/core`)

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

## Client-Side Package Usage (`@svgenio/client`)

### Basic String Conversion

```typescript
import { convert } from '@svgenio/client';

const svgContent = `<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>`;

const result = convert(svgContent, { componentName: 'MyIcon' });
console.log(result.code); // Generated React component code
```

### File Input Handling

```typescript
import { handleFileInput } from '@svgenio/client';

// Handle file input change event
const fileInput = document.getElementById('file-input') as HTMLInputElement;
fileInput.addEventListener('change', async (event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    try {
      const results = await handleFileInput(target.files, { typescript: true });
      results.forEach(result => {
        console.log(`Generated component: ${result.componentName}`);
        console.log(result.code);
      });
    } catch (error) {
      console.error('Conversion failed:', error);
    }
  }
});
```

### Drag and Drop Support

```typescript
import { handleDropEvent } from '@svgenio/client';

// Handle drag and drop events
const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  
  try {
    const results = await handleDropEvent(e, { typescript: true });
    results.forEach(result => {
      console.log(`Generated component: ${result.componentName}`);
      console.log(result.code);
    });
  } catch (error) {
    console.error('Drop conversion failed:', error);
  }
});
```

### Multiple Input Types

```typescript
import { convertAsync, convertToCodeAsync } from '@svgenio/client';

// From File object (file input)
const file = fileInput.files?.[0];
if (file) {
  const result = await convertAsync(file, { componentName: 'FileIcon' });
  console.log(result.code);
}

// From Buffer (Node.js environment)
const buffer = Buffer.from('<svg>...</svg>');
const code = await convertToCodeAsync(buffer, 'BufferIcon', true);

// From Blob
const blob = new Blob(['<svg>...</svg>'], { type: 'image/svg+xml' });
const result = await convertAsync(blob, { componentName: 'BlobIcon' });
```

### React Component Example

```tsx
import React, { useState, useRef } from 'react';
import { convertAsync, handleFileInput, handleDropEvent } from '@svgenio/client';

function SvgConverter() {
  const [componentCode, setComponentCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    setIsConverting(true);
    try {
      const results = await handleFileInput(event.target.files, { componentName: 'GeneratedIcon' });
      setComponentCode(results[0]?.code || '');
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsConverting(true);
    
    try {
      const results = await handleDropEvent(event.nativeEvent, { componentName: 'DroppedIcon' });
      setComponentCode(results[0]?.code || '');
    } catch (error) {
      console.error('Drop conversion failed:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {isConverting ? 'Converting...' : 'Drop SVG files here or click to select'}
      </div>
      
      {componentCode && (
        <pre style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
          {componentCode}
        </pre>
      )}
    </div>
  );
}
```

## API Reference

### Server-Side (`@svgenio/core`)

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

### Client-Side (`@svgenio/client`)

#### `convert(svgContent: string, options?: ConvertOptions)`

Converts SVG content string to a React component.

#### `convertAsync(input: SvgInput, options?: ConvertOptions)`

Converts various input types (string, Buffer, File, Blob) to a React component.

#### `handleFileInput(files: FileList | File[], options?: ConvertOptions)`

Helper function to handle file input change events.

#### `handleDropEvent(event: DragEvent, options?: ConvertOptions)`

Helper function to handle drag and drop events.

#### `convertToCode(svgContent: string, componentName?, typescript?)`

Converts SVG content and returns just the component code.

#### `convertToMarkup(svgContent: string)`

Converts SVG content and returns just the transformed SVG markup.

## Development

### Project Structure

```
svgenio-cli/
├── packages/
│   ├── core/          # Core conversion library (server-side)
│   ├── client/        # Client-side library (browser-safe)
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
cd packages/client && npm run build
cd packages/cli && npm run build
```

### Development Mode

```bash
# Watch mode for development
npm run dev
```

## Package Comparison

| Feature | CLI | Core | Client |
|---------|-----|------|--------|
| File system access | ✅ | ✅ | ❌ |
| Browser compatibility | ❌ | ❌ | ✅ |
| String input | ❌ | ❌ | ✅ |
| File/Blob input | ❌ | ❌ | ✅ |
| Drag & drop support | ❌ | ❌ | ✅ |
| Batch processing | ✅ | ✅ | ✅ |
| TypeScript support | ✅ | ✅ | ✅ |

## License

MIT - see [LICENSE](LICENSE) file for details. 