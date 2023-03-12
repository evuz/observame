import { OperatorFunction } from '../types'

type Filter<T> = (value: T) => boolean

export function filter<T> (test: Filter<T>): OperatorFunction<T, T> {
  return (next) => function (value: T) {
    if (test(value)) {
      next(value)
    }
  }
}
