import { createLogger, defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
// import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
// vite.config.ts
import mkcert from 'vite-plugin-mkcert'
import process from 'process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientHost = process.env.CLIENT_HOST || 'localhost'
const viteLogger = createLogger()
const viteLoggerInfo = viteLogger.info

viteLogger.info = (message, options) => {
    if (typeof message === 'string') {
        const filteredMessage = message
            .split('\n')
            .filter(line => !line.includes('➜  Local:'))
            .filter(line => !line.includes('➜  Network:') || line.includes(clientHost))
            .join('\n')

        if (!filteredMessage.trim()) return

        viteLoggerInfo(filteredMessage, options)
        return
    }

    viteLoggerInfo(message, options)
}

// https://vite.dev/config/
export default defineConfig({
    // base: '/obe-demo-app/',
    customLogger: viteLogger,
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
        mkcert()
    ],
    server: {
        https: true,
        host: clientHost,
        forwardConsole: {
            unhandledErrors: true,
            logLevels: ['warn', 'error'],
        },
        proxy: {
            '/api': {
                // target: 'https://45.140.185.63:5001',
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false
            }
        }
    }
    //   server: {
    //     host: true,
    //     https: {
    //       key: fs.readFileSync(path.resolve(__dirname, './certs/key.pem')),
    //       cert: fs.readFileSync(path.resolve(__dirname, './certs/cert.pem'))
    //     }
    //   }  
})
