import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // content/ holds the editorial data — the Persian backlog and the keyword
    // queue — and it has rules worth holding. Tests living there ran under
    // `vitest content` and nowhere else until this line existed.
    include: ['lib/**/__tests__/**/*.test.ts', 'content/**/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
