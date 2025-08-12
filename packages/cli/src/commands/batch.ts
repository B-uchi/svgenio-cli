import { Command } from "commander";
import { svgenius } from "@svgenius/core";

export default function batchCommand(program: Command) {
  program
    .command("batch <folder>")
    .description("Process multiple SVG files in a folder.")
    .option("-o, --output <folder>", "Output folder", "./output")
    .option("-t, --typescript", "Generate TypeScript components", true)
    .option("-b, --barrel", "Generate barrel file (index.ts)", false)
    .action(async (folder, options) => {
      try {
        svgenius.batch(folder, {
          typescript: options.typescript,
          outDir: options.output,
          barrelFile: options.barrel
        });
        console.log(`✅ Batch conversion complete: ${options.output}`);
      } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
      }
    });
}
