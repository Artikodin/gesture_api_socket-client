import { terser } from 'rollup-plugin-terser';
// doc : https://github.com/thgh/rollup-plugin-serve
import serve from 'rollup-plugin-serve';
// doc : https://github.com/rollup/rollup-plugin-babel
import babel from 'rollup-plugin-babel';
// doc : https://github.com/thgh/rollup-plugin-livereload
import livereload from 'rollup-plugin-livereload';
// doc : https://github.com/rollup/plugins/tree/master/packages/node-resolve
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [
    {
      entryFileNames: 'bundle.js',
      dir: 'dist',
      format: 'iife'
    },
    {
      entryFileNames: 'bundle.min.js',
      dir: 'dist',
      format: 'iife',
      name: 'version',
      plugins: [terser()]
    }
  ],
  sourcemap: 'inline',
  watch: { include: ['src/**', 'public/**'] },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    serve({
      contentBase: ['dist', 'public'],
      open: true,
      port: 3000
    }),
    livereload({
      watch: ['dist', 'public']
    }),
    babel({
      include: 'src/**'
    })
  ]
};
