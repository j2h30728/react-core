import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import path from "path";

export default defineConfig({
  plugins: [
    babel({
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [
          [
            "@babel/plugin-transform-react-jsx",
            {
              runtime: "automatic",
              importSource: "custom-jsx-library",
              development: false,
            },
          ],
        ],
      },
      filter: /\.[tj]sx?$/,
    }),
  ],
  resolve: {
    alias: {
      // 명시적으로 경로 지정
      "custom-jsx-library": path.resolve(__dirname, "src/custom-jsx-library"),
    },
  },
  build: {
    sourcemap: true,
    minify: false,
  },
});
