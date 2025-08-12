import { ConvertOptions } from ".";


/**
 * Wrap the SVG markup in a React component string.
 */
export function generateReactComponent(
  svgMarkup: string,
  componentName: string,
  options: ConvertOptions
): string {
  const ts = options.typescript ?? true;

  const propsSpreadMarkup = svgMarkup.replace("<svg", "<svg {...props}");

  if (ts) {
    return `import * as React from "react";

export const ${componentName}: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  ${propsSpreadMarkup}
);
`;
  } else {
    return `import * as React from "react";

export const ${componentName} = (props) => (
  ${propsSpreadMarkup}
);
`;
  }
} 