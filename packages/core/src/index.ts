import { parseSvg } from "./parser.js";
import { transformSvg } from "./transformer.js";
import { generateReactComponent } from "./generator.js";
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";
import { toPascalCase } from "./utility.js";

export interface ConvertOptions {
  typescript?: boolean;
  componentName?: string;
}

export interface BatchOptions {
  typescript?: boolean;
  barrelFile?: boolean;
  outDir?: string;
}

function convert(filePath: string, options: ConvertOptions = {}) {
  // Check if file exists before trying to read it
  if (!existsSync(filePath)) {
    throw new Error(`❌ SVG file not found: "${filePath}"\n   Please check the file path and make sure the file exists.`);
  }

  // Check if file has .svg extension
  if (!filePath.toLowerCase().endsWith('.svg')) {
    throw new Error(`❌ Invalid file type: "${filePath}"\n   Please provide a valid SVG file with .svg extension.`);
  }

  const svgContent = readFileSync(filePath, "utf-8");

  // Check if file is empty
  if (!svgContent.trim()) {
    throw new Error(`❌ Empty SVG file: "${filePath}"\n   The file appears to be empty. Please provide a valid SVG file with content.`);
  }

  const svgMarkup = parseSvg(svgContent);
  const transformedMarkup = transformSvg(svgMarkup);

  const baseName = basename(filePath, ".svg");
  const componentName =
    options.componentName ?? toPascalCase(baseName);

  const code = generateReactComponent(transformedMarkup, componentName, options);

  return { componentName, code };
}

function batch(folderPath: string, options: BatchOptions = {}) {
  // Check if folder exists
  if (!existsSync(folderPath)) {
    throw new Error(`❌ Folder not found: "${folderPath}"\n   Please check the folder path and make sure it exists.`);
  }

  const ts = options.typescript ?? true;
  const outDir = options.outDir ?? folderPath;

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const barrelExports: string[] = [];

  const files = readdirSync(folderPath).filter((f) => f.endsWith(".svg"));
  
  if (files.length === 0) {
    throw new Error(`❌ No SVG files found in: "${folderPath}"\n   Please make sure the folder contains .svg files.`);
  }

  for (const file of files) {
    const { componentName, code } = convert(join(folderPath, file), options);
    const outFile = join(outDir, `${componentName}.${ts ? "tsx" : "jsx"}`);
    writeFileSync(outFile, code, "utf-8");
    barrelExports.push(`export * from "./${componentName}";`);
  }

  if (options.barrelFile) {
    const barrelPath = join(outDir, `index.${ts ? "ts" : "js"}`);
    writeFileSync(barrelPath, barrelExports.join("\n") + "\n", "utf-8");
  }
}

export const svgenio = {
  convert,
  batch,
};

export default svgenio;
