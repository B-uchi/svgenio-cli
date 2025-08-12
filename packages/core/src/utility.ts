import camelCase from "camelcase";

/**
 * Convert a string to PascalCase.
 */
export function toPascalCase(str: string): string {
  return camelCase(str, { pascalCase: true, preserveConsecutiveUppercase: true });
}
