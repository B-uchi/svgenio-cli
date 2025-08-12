import * as cheerio from "cheerio";
import camelCase from "camelcase";

/**
 * Convert attributes to camelCase and clean up unnecessary ones.
 */
function transformAttributes($: cheerio.CheerioAPI, el: any) {
  const attribs = el.attribs;
  for (const [key, value] of Object.entries(attribs)) {
    let newKey = key === "class" ? "className" : camelCase(key);
    if (["xmlns", "version"].includes(newKey)) {
      $(el).removeAttr(key);
    } else if (newKey !== key) {
      $(el).attr(newKey, value as string);
      $(el).removeAttr(key);
    }
  }
}

/**
 * Transform the SVG markup for React compatibility.
 */
export function transformSvg(svg: cheerio.Cheerio<any>): string {
  const $ = cheerio.load(svg.toString(), { xmlMode: true });

  $("svg").each((_, el) => transformAttributes($, el));
  $("svg").find("*").each((_, el) => transformAttributes($, el));

  // Remove width/height so it's scalable
  $("svg").removeAttr("width").removeAttr("height");

  return $("svg").toString();
} 