import { terser } from "rollup-plugin-terser";
// doc: https://github.com/thgh/rollup-plugin-serve
import serve from "rollup-plugin-serve";
// doc: https://github.com/rollup/rollup-plugin-babel
import babel from "rollup-plugin-babel";
import livereload from "rollup-plugin-livereload";

export default {
  input: "src/index.js",
  output: [
    {
      entryFileNames: "bundle.js",
      dir: "dist",
      format: "iife",
    },
    {
      entryFileNames: "bundle.min.js",
      dir: "dist",
      format: "iife",
      name: "version",
      plugins: [terser()],
    },
  ],
  sourceMap: "inline",
  plugins: [
    serve({
      contentBase: ["dist", "public"],
      open: true,
    }),
    livereload({
      watch: ["dist", "public"],
    }),
    babel({
      include: "src/**",
    }),
  ],
};
