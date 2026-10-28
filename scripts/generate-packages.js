#!/usr/bin/env node
/**
 * scripts/generate-packages.js
 * Generates first-class React & Vue component packages:
 * - dist/react/ (individual TSX components, barrel index.js, index.mjs, index.d.ts)
 * - dist/vue/   (individual Vue SFC/render components, barrel index.js, index.mjs, index.d.ts)
 * - unplugin resolver for Vite / Rollup / Webpack auto-imports
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const REACT_DIR = path.join(DIST_DIR, 'react');
const VUE_DIR = path.join(DIST_DIR, 'vue');
const RESOLVER_DIR = path.join(DIST_DIR, 'resolver');

[REACT_DIR, VUE_DIR, RESOLVER_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Load icon paths and metadata
const icons = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'code', 'data', 'icons.json'), 'utf8'));
const FONTS_SRC = path.join(ROOT_DIR, 'code', 'assets', 'fonts');
const svgFontContent = fs.readFileSync(path.join(FONTS_SRC, 'haticons.svg'), 'utf-8');

const glyphRe = /<glyph\s+([^>]+)>/g;
let m;
const glyphPaths = {};
while ((m = glyphRe.exec(svgFontContent)) !== null) {
  const attr = m[1];
  const nameM = attr.match(/glyph-name="([^"]+)"/);
  const dM = attr.match(/d="([^"]*)"/);
  if (nameM && dM && dM[1]) {
    glyphPaths[nameM[1]] = dM[1];
  }
}

// Helper to convert kebab-case to PascalCase with Hi prefix (e.g. cart -> HiCart, check-circle -> HiCheckCircle)
function toPascalCase(str) {
  const cleaned = str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return 'Hi' + capitalized;
}

const reactExports = [];
const vueExports = [];

icons.forEach(icon => {
  const compName = toPascalCase(icon.name);
  const d = glyphPaths[icon.name] || '';

  // 1. React Component
  const reactCode = `import * as React from 'react';

export interface ${compName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  title?: string;
}

export const ${compName} = React.forwardRef<SVGSVGElement, ${compName}Props>((props, ref) => {
  const { size = 24, color = 'currentColor', title, ...rest } = props;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      fill={color}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      <g transform="scale(1, -1) translate(0, -960)">
        <path d="${d}" />
      </g>
    </svg>
  );
});

${compName}.displayName = '${compName}';
export default ${compName};
`;
  fs.writeFileSync(path.join(REACT_DIR, `${compName}.tsx`), reactCode);

  // Precompiled CJS/ESM JS for React
  const reactJs = `"use strict";
const React = require("react");
const ${compName} = React.forwardRef((props, ref) => {
  const { size = 24, color = "currentColor", title, ...rest } = props;
  return React.createElement(
    "svg",
    {
      ref,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024",
      width: size,
      height: size,
      fill: color,
      "aria-hidden": title ? undefined : true,
      role: title ? "img" : undefined,
      ...rest
    },
    title ? React.createElement("title", null, title) : null,
    React.createElement(
      "g",
      { transform: "scale(1, -1) translate(0, -960)" },
      React.createElement("path", { d: ${JSON.stringify(d)} })
    )
  );
});
${compName}.displayName = "${compName}";
module.exports = ${compName};
module.exports.default = ${compName};
`;
  fs.writeFileSync(path.join(REACT_DIR, `${compName}.js`), reactJs);

  const reactMjs = `import * as React from "react";
export const ${compName} = React.forwardRef((props, ref) => {
  const { size = 24, color = "currentColor", title, ...rest } = props;
  return React.createElement(
    "svg",
    {
      ref,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024",
      width: size,
      height: size,
      fill: color,
      "aria-hidden": title ? undefined : true,
      role: title ? "img" : undefined,
      ...rest
    },
    title ? React.createElement("title", null, title) : null,
    React.createElement(
      "g",
      { transform: "scale(1, -1) translate(0, -960)" },
      React.createElement("path", { d: ${JSON.stringify(d)} })
    )
  );
});
${compName}.displayName = "${compName}";
export default ${compName};
`;
  fs.writeFileSync(path.join(REACT_DIR, `${compName}.mjs`), reactMjs);

  const reactDts = `import * as React from 'react';
export interface ${compName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  title?: string;
}
export declare const ${compName}: React.ForwardRefExoticComponent<${compName}Props & React.RefAttributes<SVGSVGElement>>;
export default ${compName};
`;
  fs.writeFileSync(path.join(REACT_DIR, `${compName}.d.ts`), reactDts);
  reactExports.push(compName);

  // 2. Vue 3 Component (Functional / Render Component)
  const vueJs = `"use strict";
const { h } = require("vue");
const ${compName} = (props, { attrs }) => {
  const size = props.size || 24;
  const color = props.color || "currentColor";
  const title = props.title;
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024",
      width: size,
      height: size,
      fill: color,
      "aria-hidden": title ? undefined : true,
      role: title ? "img" : undefined,
      ...attrs
    },
    [
      title ? h("title", title) : null,
      h("g", { transform: "scale(1, -1) translate(0, -960)" }, [
        h("path", { d: ${JSON.stringify(d)} })
      ])
    ]
  );
};
${compName}.props = ["size", "color", "title"];
${compName}.displayName = "${compName}";
module.exports = ${compName};
module.exports.default = ${compName};
`;
  fs.writeFileSync(path.join(VUE_DIR, `${compName}.js`), vueJs);

  const vueMjs = `import { h } from "vue";
export const ${compName} = (props, { attrs }) => {
  const size = props.size || 24;
  const color = props.color || "currentColor";
  const title = props.title;
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024",
      width: size,
      height: size,
      fill: color,
      "aria-hidden": title ? undefined : true,
      role: title ? "img" : undefined,
      ...attrs
    },
    [
      title ? h("title", title) : null,
      h("g", { transform: "scale(1, -1) translate(0, -960)" }, [
        h("path", { d: ${JSON.stringify(d)} })
      ])
    ]
  );
};
${compName}.props = ["size", "color", "title"];
${compName}.displayName = "${compName}";
export default ${compName};
`;
  fs.writeFileSync(path.join(VUE_DIR, `${compName}.mjs`), vueMjs);

  const vueDts = `import type { FunctionalComponent, SVGAttributes } from 'vue';
export interface ${compName}Props extends /* @vue-ignore */ SVGAttributes {
  size?: number | string;
  color?: string;
  title?: string;
}
export declare const ${compName}: FunctionalComponent<${compName}Props>;
export default ${compName};
`;
  fs.writeFileSync(path.join(VUE_DIR, `${compName}.d.ts`), vueDts);
  vueExports.push(compName);
});

// React Barrel exports
const reactBarrelJs = reactExports.map(n => `const ${n} = require("./${n}.js");`).join('\n') +
  `\nmodule.exports = {\n  ${reactExports.join(',\n  ')}\n};\n`;
fs.writeFileSync(path.join(REACT_DIR, 'index.js'), reactBarrelJs);

const reactBarrelMjs = reactExports.map(n => `export { ${n} } from "./${n}.mjs";`).join('\n') + '\n';
fs.writeFileSync(path.join(REACT_DIR, 'index.mjs'), reactBarrelMjs);

const reactBarrelDts = reactExports.map(n => `export { ${n}, type ${n}Props } from "./${n}";`).join('\n') + '\n';
fs.writeFileSync(path.join(REACT_DIR, 'index.d.ts'), reactBarrelDts);

// Vue Barrel exports
const vueBarrelJs = vueExports.map(n => `const ${n} = require("./${n}.js");`).join('\n') +
  `\nmodule.exports = {\n  ${vueExports.join(',\n  ')}\n};\n`;
fs.writeFileSync(path.join(VUE_DIR, 'index.js'), vueBarrelJs);

const vueBarrelMjs = vueExports.map(n => `export { ${n} } from "./${n}.mjs";`).join('\n') + '\n';
fs.writeFileSync(path.join(VUE_DIR, 'index.mjs'), vueBarrelMjs);

const vueBarrelDts = vueExports.map(n => `export { ${n}, type ${n}Props } from "./${n}";`).join('\n') + '\n';
fs.writeFileSync(path.join(VUE_DIR, 'index.d.ts'), vueBarrelDts);

// 3. Unplugin Resolver for Vite / Webpack auto-imports
const resolverJs = `/**
 * Haticons Resolver for unplugin-vue-components & unplugin-icons
 */
function HaticonsResolver(options = {}) {
  const prefix = options.prefix || 'Hi';
  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith(prefix)) {
        return {
          name,
          from: 'haticons/react/' + name
        };
      }
    }
  };
}

module.exports = {
  HaticonsResolver,
  default: HaticonsResolver
};
`;
fs.writeFileSync(path.join(RESOLVER_DIR, 'index.js'), resolverJs);

const resolverMjs = `export function HaticonsResolver(options = {}) {
  const prefix = options.prefix || 'Hi';
  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith(prefix)) {
        return {
          name,
          from: 'haticons/react/' + name
        };
      }
    }
  };
}
export default HaticonsResolver;
`;
fs.writeFileSync(path.join(RESOLVER_DIR, 'index.mjs'), resolverMjs);

const resolverDts = `export interface HaticonsResolverOptions {
  prefix?: string;
}
export declare function HaticonsResolver(options?: HaticonsResolverOptions): {
  type: string;
  resolve: (name: string) => { name: string; from: string } | undefined;
};
export default HaticonsResolver;
`;
fs.writeFileSync(path.join(RESOLVER_DIR, 'index.d.ts'), resolverDts);

console.log(`Generated ${reactExports.length} React components and ${vueExports.length} Vue 3 components with TypeScript types & Unplugin Resolver!`);
