import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dynamicImport()],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@app': path.join(__dirname, './src/app'),
      '@features': path.join(__dirname, './src/features'),
      '@layouts': path.join(__dirname, './src/layouts'),
      '@services': path.join(__dirname, './src/services'),
      '@styles': path.join(__dirname, './src/styles'),
      '@public': path.join(__dirname, './src/features/app/public'),
      '@learner': path.join(__dirname, './src/features/app/learner'),
      '@errors': path.join(__dirname, './src/features/app/errors'),
      '@portfolio': path.join(__dirname, './src/features/app/learner/features/portfolio'),
      '@calendar': path.join(__dirname, './src/features/app/learner/features/calendar'),
      '@/store': path.join(__dirname, './src/app/store'),
      '@/hooks': path.join(__dirname, './src/app/hooks'),
      '@/configs': path.join(__dirname, './src/app/config'),
      '@/constants': path.join(__dirname, './src/app/config/constants'),
      '@/auth': path.join(__dirname, './src/app/providers/auth'),
      '@/views': path.join(__dirname, './src/features'),
      '@/components': path.join(__dirname, './src/components'),
      '@/utils': path.join(__dirname, './src/utils'),
      '@/services': path.join(__dirname, './src/services'),
      '@/@types': path.join(__dirname, './src/app/types'),
      '@/assets': path.join(__dirname, './src/assets'),
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       // target: 'https://elms.edulystventures.com',
  //       target: 'http://localhost:8000',
  //       // target: 'http://10.20.3.212:8000', // for same network
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // },
  build: {
    outDir: 'build'
  }
})
