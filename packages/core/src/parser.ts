import * as cheerio from "cheerio";

/**
 * Load and return the root SVG element markup.
 */
export function parseSvg(svgContent: string): cheerio.Cheerio<any> {
  const $ = cheerio.load(svgContent, { xmlMode: true });
  const svg = $("svg");
  return svg;
}
