import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
// import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
// vite.config.ts
import mkcert from 'vite-plugin-mkcert'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
    // base: '/obe-demo-app/',
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
        mkcert()
    ],
    server: {
        https: true,
        host: true
    }
    //   server: {
    //     host: true,
    //     https: {
    //       key: fs.readFileSync(path.resolve(__dirname, './certs/key.pem')),
    //       cert: fs.readFileSync(path.resolve(__dirname, './certs/cert.pem'))
    //     }
    //   }  
})


