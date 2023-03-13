import { test, expect, describe, vi } from 'vitest'

import { observame } from '../../observame'
import { Emitter } from '../../__tests__/helpers'
import { slice } from '../slice'

describe('Operators: slice', () => {
  test('should take only first three values', () => {
    type EmitValue = number
    const unsubscribe = vi.fn()
    const emitter = new Emitter<EmitValue>(unsubscribe)

    const values: EmitValue[] = []
    observame<EmitValue>(emitter)
      .pipe(slice(0, 3))
      .subscribe(v => {
        values.push(v)
      })

    emitter.emit(0)
    emitter.emit(1)
    emitter.emit(2)
    emitter.emit(3)
    emitter.emit(4)
    emitter.emit(5)

    expect(values.length).toEqual(3)
    expect(values).toEqual([0, 1, 2])
    expect(unsubscribe).toBeCalledTimes(1)
  })

  test('should take only the three last values', () => {
    type EmitValue = number
    const unsubscribe = vi.fn()
    const emitter = new Emitter<EmitValue>(unsubscribe)

    emitter.emit(0)

    const values: EmitValue[] = []
    observame<EmitValue>(emitter)
      .pipe(slice(2, 4))
      .subscribe(v => {
        values.push(v)
      })

    emitter.emit(1)
    emitter.emit(2)
    emitter.emit(3)
    emitter.emit(4)
    emitter.emit(5)
    emitter.emit(6)

    expect(values.length).toEqual(2)
    expect(values).toEqual([3, 4])
    expect(unsubscribe).toBeCalledTimes(1)
  })
})
