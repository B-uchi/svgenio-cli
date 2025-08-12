#!/usr/bin/env node
import { Command } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import convertCommand from "./commands/convert.js";
import batchCommand from "./commands/batch.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf-8"));

const program = new Command();

program
  .name("svgenius")
  .description("A CLI tool for batch processing and converting SVGs.")
  .version(pkg.version);

// Register commands
convertCommand(program);
batchCommand(program);

// Parse CLI args
program.parse(process.argv);
