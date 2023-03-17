import { test, expect, describe, vi } from 'vitest'

import { observame } from '../../observame'
import { Emitter } from '../../__tests__/helpers'
import { take } from '../take'

describe('Operators: take', () => {
  test('should take only first five values', () => {
    type EmitValue = number
    const unsubscribe = vi.fn()
    const emitter = new Emitter<EmitValue>(unsubscribe)

    const values: EmitValue[] = []
    observame<EmitValue>(emitter)
      .pipe(take(5))
      .subscribe(v => {
        values.push(v)
      })

    emitter.emit(0)
    emitter.emit(1)
    emitter.emit(2)
    emitter.emit(3)
    emitter.emit(4)
    emitter.emit(5)

    expect(values.length).toEqual(5)
    expect(values).toEqual([0, 1, 2, 3, 4])
    expect(unsubscribe).toBeCalledTimes(1)
  })
})
