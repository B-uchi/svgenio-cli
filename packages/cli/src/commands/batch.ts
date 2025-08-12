import { Command } from "commander";
import { svgenio } from "@svgenio/core";

export default function batchCommand(program: Command) {
  program
    .command("batch <folder>")
    .description("Process multiple SVG files in a folder.")
    .option("-o, --output <folder>", "Output folder", "./output")
    .option("-t, --typescript", "Generate TypeScript components", true)
    .option("-b, --barrel", "Generate barrel file (index.ts)", false)
    .action(async (folder, options) => {
      try {
        svgenio.batch(folder, {
          typescript: options.typescript,
          outDir: options.output,
          barrelFile: options.barrel
        });
        console.log(`✅ Batch conversion complete: ${options.output}`);
        if (options.barrel) {
          console.log(`📦 Barrel file generated: ${options.output}/index.${options.typescript ? 'ts' : 'js'}`);
        }
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
