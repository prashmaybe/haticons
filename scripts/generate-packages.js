#!/usr/bin/env node
/**
 * scripts/generate-packages.js
 * Generates first-class React & Vue component packages:
 * - dist/react/ (individual TSX components, generic <Haticon />, barrel index.js, index.mjs, index.d.ts)
 * - dist/vue/   (individual Vue render components, generic <Haticon />, barrel index.js, index.mjs, index.d.ts)
 * - unplugin resolver for Vite / Rollup / Webpack auto-imports (React & Vue supported)
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

// Load icon paths, aliases, and metadata
const icons = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'code', 'data', 'icons.json'), 'utf8'));
const aliasesPath = path.join(DIST_DIR, 'data', 'aliases.json');
const aliases = fs.existsSync(aliasesPath) ? JSON.parse(fs.readFileSync(aliasesPath, 'utf8')) : {};
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

// 3. Generic Dynamic Haticon Component for React (<Haticon name="search" size={24} />)
const allIconNames = [...new Set([...icons.map(i => i.name), ...Object.keys(aliases)])];
const nameTypeUnion = allIconNames.map(n => JSON.stringify(n)).join(' | ');

const haticonReactTsx = `import * as React from 'react';
import paths from '../data/paths.js';
import aliases from '../data/aliases.json';

export type HaticonName = ${nameTypeUnion} | (string & {});

export interface HaticonProps extends React.SVGProps<SVGSVGElement> {
  name: HaticonName;
  size?: number | string;
  color?: string;
  title?: string;
}

export const Haticon = React.forwardRef<SVGSVGElement, HaticonProps>((props, ref) => {
  const { name = '', size = 24, color = 'currentColor', title, ...rest } = props;
  const clean = (name || '').replace(/^hi-/, '');
  const target = (aliases as Record<string, string>)[clean] || clean;
  const d = (paths as Record<string, string>)[target] || (paths as Record<string, string>)[clean] || '';
  if (!d) return null;
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
        <path d={d} />
      </g>
    </svg>
  );
});

Haticon.displayName = 'Haticon';
export default Haticon;
`;
fs.writeFileSync(path.join(REACT_DIR, 'Haticon.tsx'), haticonReactTsx);

const haticonReactJs = `"use strict";
const React = require("react");
const paths = require("../data/paths.js");
const aliases = require("../data/aliases.json");

const Haticon = React.forwardRef((props, ref) => {
  const { name = "", size = 24, color = "currentColor", title, ...rest } = props;
  const clean = (name || "").replace(/^hi-/, "");
  const target = aliases[clean] || clean;
  const d = paths[target] || paths[clean] || "";
  if (!d) return null;
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
      React.createElement("path", { d })
    )
  );
});
Haticon.displayName = "Haticon";
module.exports = Haticon;
module.exports.default = Haticon;
`;
fs.writeFileSync(path.join(REACT_DIR, 'Haticon.js'), haticonReactJs);

const haticonReactMjs = `import * as React from "react";
import paths from "../data/paths.js";
import aliases from "../data/aliases.json";

export const Haticon = React.forwardRef((props, ref) => {
  const { name = "", size = 24, color = "currentColor", title, ...rest } = props;
  const clean = (name || "").replace(/^hi-/, "");
  const target = aliases[clean] || clean;
  const d = paths[target] || paths[clean] || "";
  if (!d) return null;
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
      React.createElement("path", { d })
    )
  );
});
Haticon.displayName = "Haticon";
export default Haticon;
`;
fs.writeFileSync(path.join(REACT_DIR, 'Haticon.mjs'), haticonReactMjs);

const haticonReactDts = `import * as React from 'react';
export type HaticonName = ${nameTypeUnion} | (string & {});
export interface HaticonProps extends React.SVGProps<SVGSVGElement> {
  name: HaticonName;
  size?: number | string;
  color?: string;
  title?: string;
}
export declare const Haticon: React.ForwardRefExoticComponent<HaticonProps & React.RefAttributes<SVGSVGElement>>;
export default Haticon;
`;
fs.writeFileSync(path.join(REACT_DIR, 'Haticon.d.ts'), haticonReactDts);

// 4. Generic Dynamic Haticon Component for Vue 3 (<Haticon name="search" :size="24" />)
const haticonVueJs = `"use strict";
const { h } = require("vue");
const paths = require("../data/paths.js");
const aliases = require("../data/aliases.json");

const Haticon = (props, { attrs }) => {
  const name = props.name || "";
  const clean = name.replace(/^hi-/, "");
  const target = aliases[clean] || clean;
  const d = paths[target] || paths[clean] || "";
  if (!d) return null;
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
        h("path", { d })
      ])
    ]
  );
};
Haticon.props = ["name", "size", "color", "title"];
Haticon.displayName = "Haticon";
module.exports = Haticon;
module.exports.default = Haticon;
`;
fs.writeFileSync(path.join(VUE_DIR, 'Haticon.js'), haticonVueJs);

const haticonVueMjs = `import { h } from "vue";
import paths from "../data/paths.js";
import aliases from "../data/aliases.json";

export const Haticon = (props, { attrs }) => {
  const name = props.name || "";
  const clean = name.replace(/^hi-/, "");
  const target = aliases[clean] || clean;
  const d = paths[target] || paths[clean] || "";
  if (!d) return null;
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
        h("path", { d })
      ])
    ]
  );
};
Haticon.props = ["name", "size", "color", "title"];
Haticon.displayName = "Haticon";
export default Haticon;
`;
fs.writeFileSync(path.join(VUE_DIR, 'Haticon.mjs'), haticonVueMjs);

const haticonVueDts = `import type { FunctionalComponent, SVGAttributes } from 'vue';
export type HaticonName = ${nameTypeUnion} | (string & {});
export interface HaticonProps extends /* @vue-ignore */ SVGAttributes {
  name: HaticonName;
  size?: number | string;
  color?: string;
  title?: string;
}
export declare const Haticon: FunctionalComponent<HaticonProps>;
export default Haticon;
`;
fs.writeFileSync(path.join(VUE_DIR, 'Haticon.d.ts'), haticonVueDts);

// 5. React Barrel exports
const reactBarrelJs = `const Haticon = require("./Haticon.js");\n` +
  reactExports.map(n => `const ${n} = require("./${n}.js");`).join('\n') +
  `\nmodule.exports = {\n  Haticon,\n  ${reactExports.join(',\n  ')}\n};\n`;
fs.writeFileSync(path.join(REACT_DIR, 'index.js'), reactBarrelJs);

const reactBarrelMjs = `export { Haticon } from "./Haticon.mjs";\n` +
  reactExports.map(n => `export { ${n} } from "./${n}.mjs";`).join('\n') + '\n';
fs.writeFileSync(path.join(REACT_DIR, 'index.mjs'), reactBarrelMjs);

const reactBarrelDts = `export { Haticon, type HaticonProps, type HaticonName } from "./Haticon";\n` +
  reactExports.map(n => `export { ${n}, type ${n}Props } from "./${n}";`).join('\n') + '\n';
fs.writeFileSync(path.join(REACT_DIR, 'index.d.ts'), reactBarrelDts);

// 6. Vue Barrel exports
const vueBarrelJs = `const Haticon = require("./Haticon.js");\n` +
  vueExports.map(n => `const ${n} = require("./${n}.js");`).join('\n') +
  `\nmodule.exports = {\n  Haticon,\n  ${vueExports.join(',\n  ')}\n};\n`;
fs.writeFileSync(path.join(VUE_DIR, 'index.js'), vueBarrelJs);

const vueBarrelMjs = `export { Haticon } from "./Haticon.mjs";\n` +
  vueExports.map(n => `export { ${n} } from "./${n}.mjs";`).join('\n') + '\n';
fs.writeFileSync(path.join(VUE_DIR, 'index.mjs'), vueBarrelMjs);

const vueBarrelDts = `export { Haticon, type HaticonProps, type HaticonName } from "./Haticon";\n` +
  vueExports.map(n => `export { ${n}, type ${n}Props } from "./${n}";`).join('\n') + '\n';
fs.writeFileSync(path.join(VUE_DIR, 'index.d.ts'), vueBarrelDts);

// 7. Unplugin Resolver for Vite / Rollup / Webpack auto-imports (React & Vue supported)
const resolverJs = `/**
 * Haticons Resolver for unplugin-vue-components & unplugin-icons
 * Supports both Vue and React setups.
 */
function HaticonsResolver(options = {}) {
  const prefix = options.prefix || 'Hi';
  const framework = options.framework || 'vue';
  const base = framework === 'react' ? 'haticons/react/' : 'haticons/vue/';
  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith(prefix)) {
        return {
          name,
          from: base + name
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
  const framework = options.framework || 'vue';
  const base = framework === 'react' ? 'haticons/react/' : 'haticons/vue/';
  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith(prefix)) {
        return {
          name,
          from: base + name
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
  framework?: 'vue' | 'react';
}
export declare function HaticonsResolver(options?: HaticonsResolverOptions): {
  type: string;
  resolve: (name: string) => { name: string; from: string } | undefined;
};
export default HaticonsResolver;
`;
fs.writeFileSync(path.join(RESOLVER_DIR, 'index.d.ts'), resolverDts);

console.log(`Generated ${reactExports.length} React components + <Haticon />, and ${vueExports.length} Vue 3 components + <Haticon /> with TypeScript types & Unplugin Resolver!`);
