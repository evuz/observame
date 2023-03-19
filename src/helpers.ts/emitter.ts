import { Subscription } from '../subscription'
import { Handler } from '../types'

export class Emitter<T> {
  private listeners: Function[] = []

  emit (v: T) {
    this.listeners.forEach(fn => fn(v))
  }

  subscribe<T> (handler: Handler<T>) {
    const length = this.listeners.push(handler)
    const index = length - 1
    let alive = true

    return new Subscription(() => {
      if (!alive) return

      alive = false
      this.listeners.splice(index, 1)
    })
  }
}
