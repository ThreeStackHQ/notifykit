import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/notifykit.min.js',
    format: 'iife',
    name: 'NotifyKitLoader',
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
    }),
    terser(),
  ],
};
