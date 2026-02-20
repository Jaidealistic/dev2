import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        include: ['**/*.test.tsx', '**/*.test.ts'],
        exclude: ['**/node_modules/**', '**/e2e/**', '.next/**'],
        globals: true,
        // setupFiles: ['./src/test/setup.ts'], // Disable if not exists
    },
    resolve: {
        alias: {
            '@/db': path.resolve(__dirname, './lib/db'),
            '@': path.resolve(__dirname, './'),
        },
    },
});
