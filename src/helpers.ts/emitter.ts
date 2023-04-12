import { Subscription } from '../subscription'
import { Handler } from '../types'

export class Emitter<T> {
  private listeners: Function[] = []

  emit (v: T) {
    this.listeners.forEach(fn => fn(v))
  }

  subscribe<T> (handler: Handler<T>) {
    this.listeners.push(handler)
    let alive = true

    return new Subscription(() => {
      if (!alive) return

      alive = false
      this.listeners.splice(this.listeners.indexOf(handler), 1)
    })
  }
}
