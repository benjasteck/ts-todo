import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 💡 This line is non-negotiable for DOM-based testing
    environment: 'jsdom',

    // The rest of your configuration
    globals: true,
  },
});
