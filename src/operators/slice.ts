import { OperatorFunction } from '../types'

export function slice<T> (from: number, to: number): OperatorFunction<T, T> {
  return (next, unsubscribe) => {
    let i = 0
    let alive = true
    return function (value: T) {
      if (i >= from && i < to) {
        next(value)
      }

      i = i + 1

      if (alive && i >= to) {
        unsubscribe()
        alive = false
      }
    }
  }
}
