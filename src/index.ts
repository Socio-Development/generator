import { loadConfig } from './loaders'
import { GeneratorOptions } from './types'

export { defineConfig } from './config'

export function generate(options: GeneratorOptions): void {
  //const controller = new GeneratorController(options)
  //controller.write()
  loadConfig()
}
