import GeneratorController from './controller'
import { GeneratorOptions } from './types'

export function generate(options: GeneratorOptions): void {
  const controller = new GeneratorController(options)
  //controller.write()

  console.log(controller)
}
