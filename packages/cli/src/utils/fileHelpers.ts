import * as fs from "fs";

export function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readSVGFiles(folder: string): string[] {
  return fs.readdirSync(folder).filter((f) => f.endsWith(".svg"));
}

export function writeFile(filePath: string, data: string) {
  fs.writeFileSync(filePath, data, "utf-8");
}
