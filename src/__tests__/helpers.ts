import { Subscription } from '../subscription'
import { Handler } from '../types'

export class Emitter<T> {
  private listeners: Function[] = []

  constructor (private unsubscribe?: () => void) {}

  emit (v: T) {
    this.listeners.forEach(fn => fn(v))
  }

  subscribe<T> (handler: Handler<T>) {
    this.listeners.push(handler)

    return new Subscription(() => {
      this.listeners.splice(this.listeners.indexOf(handler, 1))
      this.unsubscribe?.()
    })
  }
}
