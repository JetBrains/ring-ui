import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    watch: false,
    environment: 'jsdom',
    restoreMocks: true,
    unstubGlobals: true,
    alias: [
      {
        find: /.*\.css$/,
        replacement: 'identity-obj-proxy',
      },
    ],
    reporters: ['default', ...(process.env.TEAMCITY_VERSION ? ['vitest-teamcity-reporter'] : [])],
    setupFiles: ['test-helpers/vitest-setup.js'],
  },
});
