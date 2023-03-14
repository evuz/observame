import { Emitter } from './helpers.ts/emitter'
import { Observame } from './observame'

export class Emitme<T> extends Observame<T> {
  protected emitter: Emitter<T>

  constructor () {
    const emitter = new Emitter()
    super(emitter)

    this.emitter = emitter
  }

  emit (value: T) {
    return this.emitter.emit(value)
  }
}
