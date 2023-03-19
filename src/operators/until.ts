import { OperatorFunction, Subscribable } from '../types'

export function until<T> (src: Subscribable<any>): OperatorFunction<T, T> {
  return (_, unsubscribe) => {
    let alive = true

    const subscription = src.subscribe(() => {
      alive = false
      unsubscribe()
      subscription.unsubscribe()
    })

    return [undefined, () => {
      if (alive) subscription.unsubscribe()
    }]
  }
}
