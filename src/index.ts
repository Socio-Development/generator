import GeneratorController from './controller'
import defaultConfig from './defaultConfig'
import { GeneratorConfig, GeneratorOptions } from './types'

export function defineConfig(config: Partial<GeneratorConfig>): GeneratorConfig {
  return {
    ...defaultConfig,
    ...config
  }
}

export function generate(options: GeneratorOptions): void {
  const controller = new GeneratorController(options)
  controller.write()
}
