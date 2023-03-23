import { OperatorFunction } from '../types'

type Comparator<T> = (prev: T, current: T) => boolean

function simpleComparator<T> (prev:T, current: T) {
  return prev === current
}

export function distinct<T> (comparator: Comparator<T> = simpleComparator): OperatorFunction<T, T> {
  return (next) => {
    let state: T
    let init = false

    function emit (value: T) {
      state = value
      next(value)
    }

    return function (value: T) {
      if (!init) {
        init = true
        return emit(value)
      }

      const isSame = comparator(state, value)
      if (!isSame) {
        emit(value)
      }
    }
  }
}
