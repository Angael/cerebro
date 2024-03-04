import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: 'esm',
  shims: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
