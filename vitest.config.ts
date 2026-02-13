import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
        exclude: ['**/node_modules/**', '**/e2e/**'],
        globals: true,
        setupFiles: ['./src/test/setup.ts'], // Assuming setup file exists or will be created
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
