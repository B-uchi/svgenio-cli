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
  const svgContent = readFileSync(filePath, "utf-8");

  const svgMarkup = parseSvg(svgContent);
  const transformedMarkup = transformSvg(svgMarkup);

  const baseName = basename(filePath, ".svg");
  const componentName =
    options.componentName ?? toPascalCase(baseName);

  const code = generateReactComponent(transformedMarkup, componentName, options);

  return { componentName, code };
}

function batch(folderPath: string, options: BatchOptions = {}) {
  const ts = options.typescript ?? true;
  const outDir = options.outDir ?? folderPath;

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const barrelExports: string[] = [];

  const files = readdirSync(folderPath).filter((f) => f.endsWith(".svg"));
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

export const svgenius = {
  convert,
  batch,
};

export default svgenius;
