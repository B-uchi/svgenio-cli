# @svgenio/client

A client-side SVG to React component conversion library. This package provides the same core functionality as `@svgenio/core` but is designed to work in browser environments and React/Next.js applications without Node.js file system dependencies.

## Features

- 🚀 **Client-side safe**: No Node.js file system dependencies
- ⚡ **Fast conversion**: Convert SVG strings to React components instantly
- 🎯 **TypeScript support**: Full TypeScript support with proper types
- 🔧 **Flexible options**: Customize component names and TypeScript output
- 📦 **Lightweight**: Only essential dependencies for browser environments
- 📁 **Multiple input types**: Support for string, Buffer, File, and Blob inputs
- 🖱️ **Drag & Drop ready**: Built-in helpers for file input and drag-and-drop events

## Installation

```bash
npm install @svgenio/client
```

## Usage

### Basic Conversion

```typescript
import { convert } from '@svgenio/client';

const svgContent = `<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>`;

const result = convert(svgContent, { componentName: 'MyIcon' });
console.log(result.code);
// Outputs React component code
```

### Converting Different Input Types

```typescript
import { convertAsync, convertToCodeAsync } from '@svgenio/client';

// From File object (file input)
const fileInput = document.getElementById('file-input') as HTMLInputElement;
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

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  
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

### Convert to Code Only

```typescript
import { convertToCode, convertToCodeAsync } from '@svgenio/client';

// From string
const svgContent = `<svg>...</svg>`;
const componentCode = convertToCode(svgContent, 'MyIcon', true);

// From File
const file = /* file from input */;
const code = await convertToCodeAsync(file, 'FileIcon', true);
```

### Convert Multiple SVGs

```typescript
import { convertMultiple, convertMultipleAsync } from '@svgenio/client';

// From strings
const svgContents = [
  { content: '<svg>...</svg>', name: 'icon1' },
  { content: '<svg>...</svg>', name: 'icon2' }
];

const results = convertMultiple(svgContents, { typescript: true });

// From mixed input types
const inputs = [
  { input: '<svg>...</svg>', name: 'string-icon' },
  { input: fileObject, name: 'file-icon' },
  { input: bufferObject, name: 'buffer-icon' }
];

const asyncResults = await convertMultipleAsync(inputs, { typescript: true });
```

### Get Transformed Markup Only

```typescript
import { convertToMarkup, convertToMarkupAsync } from '@svgenio/client';

// From string
const svgContent = `<svg width="24" height="24" class="my-class">...</svg>`;
const transformedMarkup = convertToMarkup(svgContent);
// Returns: <svg viewBox="0 0 24 24" className="my-class">...</svg>

// From File
const file = /* file from input */;
const markup = await convertToMarkupAsync(file);
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

### `convert(svgContent, options?)`

Converts SVG content string to a React component.

**Parameters:**
- `svgContent` (string): The SVG markup as a string
- `options` (ConvertOptions, optional): Conversion options

**Returns:** `ConversionResult`

### `convertAsync(input, options?)`

Converts various input types to a React component.

**Parameters:**
- `input` (SvgInput): The SVG input (string, Buffer, File, or Blob)
- `options` (ConvertOptions, optional): Conversion options

**Returns:** `Promise<ConversionResult>`

### `convertSvg(svgContent, options?)`

Alias for `convert()`.

### `convertMultiple(svgContents, options?)`

Converts multiple SVG content strings to React components.

**Parameters:**
- `svgContents` (Array<{content: string, name?: string}>): Array of SVG content objects
- `options` (ConvertOptions, optional): Conversion options

**Returns:** `ConversionResult[]`

### `convertMultipleAsync(inputs, options?)`

Converts multiple SVG inputs of various types to React components.

**Parameters:**
- `inputs` (Array<{input: SvgInput, name?: string}>): Array of SVG input objects
- `options` (ConvertOptions, optional): Conversion options

**Returns:** `Promise<ConversionResult[]>`

### `convertToCode(svgContent, componentName?, typescript?)`

Converts SVG content string and returns just the component code.

**Parameters:**
- `svgContent` (string): The SVG markup as a string
- `componentName` (string, optional): Name for the component
- `typescript` (boolean, optional): Whether to generate TypeScript code (default: true)

**Returns:** `string`

### `convertToCodeAsync(input, componentName?, typescript?)`

Converts various input types and returns just the component code.

**Parameters:**
- `input` (SvgInput): The SVG input (string, Buffer, File, or Blob)
- `componentName` (string, optional): Name for the component
- `typescript` (boolean, optional): Whether to generate TypeScript code (default: true)

**Returns:** `Promise<string>`

### `convertToMarkup(svgContent)`

Converts SVG content string and returns just the transformed SVG markup.

**Parameters:**
- `svgContent` (string): The SVG markup as a string

**Returns:** `string`

### `convertToMarkupAsync(input)`

Converts various input types and returns just the transformed SVG markup.

**Parameters:**
- `input` (SvgInput): The SVG input (string, Buffer, File, or Blob)

**Returns:** `Promise<string>`

### `handleFileInput(files, options?)`

Helper function to handle file input change events.

**Parameters:**
- `files` (FileList | File[]): Files from file input or drag event
- `options` (ConvertOptions, optional): Conversion options

**Returns:** `Promise<ConversionResult[]>`

### `handleDropEvent(event, options?)`

Helper function to handle drag and drop events.

**Parameters:**
- `event` (DragEvent): The drop event
- `options` (ConvertOptions, optional): Conversion options

**Returns:** `Promise<ConversionResult[]>`

### `toPascalCase(str)`

Converts a string to PascalCase.

**Parameters:**
- `str` (string): The string to convert

**Returns:** `string`

## Types

### `ConvertOptions`

```typescript
interface ConvertOptions {
  typescript?: boolean;      // Generate TypeScript code (default: true)
  componentName?: string;    // Custom component name
}
```

### `ConversionResult`

```typescript
interface ConversionResult {
  componentName: string;     // Generated component name
  code: string;             // React component code
}
```

### `SvgInput`

```typescript
type SvgInput = string | Buffer | File | Blob;
```

## Differences from @svgenio/core

- **No file system operations**: Works with SVG content strings instead of file paths
- **Client-side safe**: Can be used in browsers, React, Next.js, and other client environments
- **Multiple input types**: Supports string, Buffer, File, and Blob inputs
- **Async support**: Provides async versions of all conversion functions
- **File handling helpers**: Built-in support for file input and drag-and-drop events
- **Additional utilities**: Provides helper functions like `convertToCode()` and `convertToMarkup()`
- **Batch processing**: `convertMultiple()` and `convertMultipleAsync()` for handling multiple SVGs

## Browser Support

This package works in all modern browsers that support ES2020 features and the File API.

## License

MIT 