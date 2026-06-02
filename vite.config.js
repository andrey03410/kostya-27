import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// На GitHub Pages сайт живёт в подпапке /kostya-27/, поэтому при сборке нужен base.
// В dev-режиме оставляем корень '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/kostya-27/' : '/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
}))
