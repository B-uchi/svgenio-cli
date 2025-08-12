# @svgenio/cli

Command-line tool for converting SVG files to React components with TypeScript support.

## Installation

```bash
npm install -g @svgenio/cli
```

## Usage

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

## Features

- 🎯 **Single SVG Conversion**: Convert individual SVG files to React components
- 📁 **Batch Processing**: Process entire folders of SVG files at once
- 🔧 **TypeScript Support**: Generate TypeScript components with proper type definitions
- 📦 **Barrel Exports**: Automatically generate index files for easy imports
- 🎨 **React Optimized**: Transform SVG attributes for React compatibility (e.g., `class` → `className`)
- 🚀 **User-Friendly**: Detailed error messages and helpful feedback

## Error Handling

The CLI provides detailed error messages for common issues:

- File not found
- Invalid file type (non-SVG files)
- Empty SVG files
- Folder not found
- No SVG files in folder

## Examples

### Convert a single icon
```bash
svgenio convert icon.svg -o src/components/Icon.tsx -n Icon
# ✅ Converted: src/components/Icon.tsx
# 📝 Component name: Icon
```

### Batch convert with barrel file
```bash
svgenio batch icons/ -o src/components/icons --barrel
# ✅ Batch conversion complete: src/components/icons
# 📦 Barrel file generated: src/components/icons/index.ts
```

## Related

- [`@svgenio/core`](../core) - Core library for programmatic usage

## License

MIT - see [LICENSE](../../LICENSE) file for details. 