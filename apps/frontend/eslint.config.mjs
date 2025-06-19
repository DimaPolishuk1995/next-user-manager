import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.extends("eslint-config-prettier"),
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": [
        "warn",
        {
          singleQuote: false,
          trailingComma: "all",
          arrowParens: "always",
          semi: true,
          printWidth: 140,
          tabWidth: 4,
          endOfLine: "auto",
        },
      ],
    },
  },
];

export default eslintConfig;
