import { OperatorFunction } from '../types'
import { slice } from './slice'

export function skip<T> (from: number): OperatorFunction<T, T> {
  return slice(from, Infinity)
}
