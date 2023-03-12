import { OperatorFunction } from '../types'

type Mapper<T, K> = (value: T) => K

export function map<T, K> (mapper: Mapper<T, K>): OperatorFunction<T, K> {
  return (next) => function (value: T) {
    next(mapper(value))
  }
}
