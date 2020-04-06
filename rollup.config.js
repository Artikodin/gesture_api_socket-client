import { terser } from 'rollup-plugin-terser';
// doc : https://github.com/rollup/rollup-plugin-babel
import babel from 'rollup-plugin-babel';
// doc : https://github.com/thgh/rollup-plugin-livereload
import livereload from 'rollup-plugin-livereload';
// doc : https://github.com/rollup/plugins/tree/master/packages/node-resolve
import resolve from '@rollup/plugin-node-resolve';
// doc : https://github.com/rollup/plugins/tree/master/packages/commonjs
import commonjs from '@rollup/plugin-commonjs';
// doc : https://github.com/pearofducks/rollup-plugin-dev

import serve from 'rollup-plugin-server';
import fs from 'fs';

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
  watch: { include: ['src/**', 'public/**'] },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    serve({
      contentBase: ['dist', 'public'],
      port: 3000,
      ssl: true,
      ssl_key: fs.readFileSync('./certificat/server.key'),
      ssl_cert: fs.readFileSync('./certificat/server.crt')
    }),
    livereload({
      https: {
        key: fs.readFileSync('./certificat/server.key'),
        cert: fs.readFileSync('./certificat/server.crt')
      },
      watch: ['dist', 'public']
    }),
    babel({
      include: 'src/**'
    })
  ]
};
