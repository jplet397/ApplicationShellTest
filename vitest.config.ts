import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Redirect Module Federation remote specifiers to local stubs during tests
      'mfe1/component': path.resolve(__dirname, 'src/shell/__tests__/__mocks__/mfe1-component.ts'),
      'about/component': path.resolve(__dirname, 'src/shell/__tests__/__mocks__/about-component.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/shell/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/shell/**/*.ts'],
      exclude: ['src/shell/__tests__/**'],
    },
  },
});
