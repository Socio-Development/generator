import { defineConfig } from './src'

export default defineConfig({
  dotPrefixWhitelist: {
    files: ['.env'],
  },
})
