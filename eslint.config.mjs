import cssModules from "eslint-plugin-css-modules";

export default [
  { ignores: ["node_modules/", ".next/", "out/", "public/"] },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "css-modules": cssModules },
    rules: {
      "css-modules/no-unused-class": ["error", { camelCase: true }],
      "css-modules/no-undef-class": "off",
    },
  },
];
