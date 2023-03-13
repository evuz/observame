import { test, expect, describe, vi } from 'vitest'

import { observame } from '../../observame'
import { Emitter } from '../../__tests__/helpers'
import { skip } from '../skip'

describe('Operators: skip', () => {
  test('should skip three first values', () => {
    type EmitValue = number
    const unsubscribe = vi.fn()
    const emitter = new Emitter<EmitValue>(unsubscribe)

    emitter.emit(0)
    emitter.emit(1)

    const values: EmitValue[] = []
    observame<EmitValue>(emitter)
      .pipe(skip(2))
      .subscribe(v => {
        values.push(v)
      })

    emitter.emit(2)
    emitter.emit(3)
    emitter.emit(4)
    emitter.emit(5)

    expect(values).toEqual([4, 5])
    expect(unsubscribe).not.toBeCalled()
  })
})
