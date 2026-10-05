import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config'

const bg = { padding: 0, resizeOptions: { background: '#021b3d' } }

export default defineConfig({
  preset: {
    ...preset,
    maskable: { ...preset.maskable, ...bg },
    apple: { ...preset.apple, ...bg },
  },
  images: ['public/icon.svg'],
})
