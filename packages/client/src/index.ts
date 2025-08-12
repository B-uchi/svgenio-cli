import { parseSvg } from "./parser.js";
import { transformSvg } from "./transformer.js";
import { generateReactComponent } from "./generator.js";
import { toPascalCase } from "./utility.js";

export interface ConvertOptions {
  typescript?: boolean;
  componentName?: string;
}

export interface ConversionResult {
  componentName: string;
  code: string;
}

export type SvgInput = string | Buffer | File | Blob;

/**
 * Convert various input types to SVG content string.
 */
async function normalizeSvgInput(input: SvgInput): Promise<string> {
  if (typeof input === 'string') {
    return input;
  }
  
  if (Buffer.isBuffer(input)) {
    return input.toString('utf-8');
  }
  
  if (input instanceof File || input instanceof Blob) {
    return await input.text();
  }
  
  throw new Error(`❌ Unsupported input type: ${typeof input}\n   Supported types: string, Buffer, File, Blob`);
}

/**
 * Convert SVG content string to a React component.
 */
function convertSvg(svgContent: string, options: ConvertOptions = {}): ConversionResult {
  // Check if content is empty
  if (!svgContent.trim()) {
    throw new Error(`❌ Empty SVG content provided.\n   Please provide valid SVG content.`);
  }

  const svgMarkup = parseSvg(svgContent);
  const transformedMarkup = transformSvg(svgMarkup);

  // Generate a component name if not provided
  const componentName = options.componentName ?? "SvgComponent";

  const code = generateReactComponent(transformedMarkup, componentName, options);

  return { componentName, code };
}

/**
 * Convert SVG content string to a React component with auto-generated name.
 * Uses the provided name or generates one from the content.
 */
function convert(svgContent: string, options: ConvertOptions = {}): ConversionResult {
  return convertSvg(svgContent, options);
}

/**
 * Convert various input types (string, Buffer, File, Blob) to a React component.
 */
async function convertAsync(input: SvgInput, options: ConvertOptions = {}): Promise<ConversionResult> {
  const svgContent = await normalizeSvgInput(input);
  return convertSvg(svgContent, options);
}

/**
 * Convert multiple SVG inputs to React components.
 */
function convertMultiple(
  svgContents: Array<{ content: string; name?: string }>,
  options: ConvertOptions = {}
): ConversionResult[] {
  return svgContents.map(({ content, name }) => {
    const componentOptions = { ...options };
    if (name) {
      componentOptions.componentName = toPascalCase(name);
    }
    return convertSvg(content, componentOptions);
  });
}

/**
 * Convert multiple SVG inputs of various types to React components.
 */
async function convertMultipleAsync(
  inputs: Array<{ input: SvgInput; name?: string }>,
  options: ConvertOptions = {}
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];
  
  for (const { input, name } of inputs) {
    const componentOptions = { ...options };
    if (name) {
      componentOptions.componentName = toPascalCase(name);
    }
    const result = await convertAsync(input, componentOptions);
    results.push(result);
  }
  
  return results;
}

/**
 * Convert SVG content and return just the component code as a string.
 */
function convertToCode(svgContent: string, componentName?: string, typescript = true): string {
  const options: ConvertOptions = {
    typescript,
    componentName: componentName ? toPascalCase(componentName) : undefined
  };
  
  const result = convertSvg(svgContent, options);
  return result.code;
}

/**
 * Convert various input types and return just the component code as a string.
 */
async function convertToCodeAsync(input: SvgInput, componentName?: string, typescript = true): Promise<string> {
  const svgContent = await normalizeSvgInput(input);
  return convertToCode(svgContent, componentName, typescript);
}

/**
 * Convert SVG content and return just the transformed SVG markup.
 */
function convertToMarkup(svgContent: string): string {
  if (!svgContent.trim()) {
    throw new Error(`❌ Empty SVG content provided.\n   Please provide valid SVG content.`);
  }

  const svgMarkup = parseSvg(svgContent);
  return transformSvg(svgMarkup);
}

/**
 * Convert various input types and return just the transformed SVG markup.
 */
async function convertToMarkupAsync(input: SvgInput): Promise<string> {
  const svgContent = await normalizeSvgInput(input);
  return convertToMarkup(svgContent);
}

/**
 * Helper function to handle file input change events.
 */
function handleFileInput(files: FileList | File[], options: ConvertOptions = {}): Promise<ConversionResult[]> {
  const fileArray = Array.from(files);
  const inputs = fileArray.map(file => ({ input: file as SvgInput, name: file.name.replace(/\.svg$/i, '') }));
  return convertMultipleAsync(inputs, options);
}

/**
 * Helper function to handle drag and drop events.
 */
function handleDropEvent(event: DragEvent, options: ConvertOptions = {}): Promise<ConversionResult[]> {
  if (!event.dataTransfer?.files) {
    throw new Error('No files found in drop event');
  }
  
  const files = Array.from(event.dataTransfer.files).filter(file => 
    file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
  );
  
  if (files.length === 0) {
    throw new Error('No SVG files found in drop event');
  }
  
  return handleFileInput(files, options);
}

export const svgenioClient = {
  convert,
  convertAsync,
  convertSvg,
  convertMultiple,
  convertMultipleAsync,
  convertToCode,
  convertToCodeAsync,
  convertToMarkup,
  convertToMarkupAsync,
  handleFileInput,
  handleDropEvent,
  toPascalCase,
};

export default svgenioClient; 