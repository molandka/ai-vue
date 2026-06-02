import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host:'0.0.0.0',
    port:5173,
    allowedHosts:['localhost','127.0.0.1','159.75.169.224','www.ryp2d3kv3.nyat.app','64.49.47.164'],
    open:true,
    proxy:{
      '/api':{
        target:'http://159.75.169.224:1235',
        changeOrigin:true,
      }
    }
  }
})
