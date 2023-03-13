import { OperatorFunction } from '../types'
import { slice } from './slice'

export function take<T> (to: number): OperatorFunction<T, T> {
  return slice(0, to)
}
