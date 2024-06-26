import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import vuetify from 'vite-plugin-vuetify';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@axios': fileURLToPath(new URL('./src/plugins/axios', import.meta.url)),

    }
  },
  build: {
    chunkSizeWarningLimit: 5000,
    outDir:'/chronorace/git/chronorace-git/Applications/bin/web/chrono/playlist'
  },
  base:'/playlist/',


  server: {
    port: 5173,
    host: true
  }

})
