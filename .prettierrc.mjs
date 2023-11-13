/** @type {import("prettier").Config} */
export default {
  arrowParens: "always",
  bracketSpacing: false,
  printWidth: 140,
  proseWrap: "always",
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
  pluginSearchDirs: false,
};
