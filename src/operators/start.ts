import { OperatorFunction } from '../types'

export function start<T> (initialValue: T): OperatorFunction<T, T> {
  return (next) => {
    next(initialValue)
    return function (value) {
      next(value)
    }
  }
}
