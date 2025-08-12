import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { svgenio } from "@svgenio/core";

export default function convertCommand(program: Command) {
  program
    .command("convert <input>")
    .description("Convert a single SVG file to React component.")
    .option("-o, --output <path>", "Output file path")
    .option("-t, --typescript", "Generate TypeScript component", true)
    .option("-n, --name <name>", "Component name")
    .action(async (input, options) => {
      try {
        const result = svgenio.convert(input, {
          typescript: options.typescript,
          componentName: options.name
        });

        const outputPath = options.output
          ? options.output
          : path.join(process.cwd(), `${result.componentName}.${options.typescript ? 'tsx' : 'jsx'}`);

        fs.writeFileSync(outputPath, result.code);
        console.log(`✅ Converted: ${outputPath}`);
        console.log(`📝 Component name: ${result.componentName}`);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("❌ An unexpected error occurred:", err);
        }
        process.exit(1);
      }
    });
}
