import { test, expect, describe } from 'vitest'

import { observame } from '../../observame'
import { Emitter } from '../../__tests__/helpers'
import { map } from '../map'

describe('Operators: map', () => {
  test('should map the numbers', () => {
    const emitter = new Emitter<number>()

    const values: number[] = []
    observame<number>(emitter).pipe(map(v => v * 10)).subscribe(v => {
      values.push(v)
    })

    emitter.emit(1)
    emitter.emit(2)
    expect(values).toEqual([10, 20])
  })

  test('should map the object', () => new Promise<void>(resolve => {
    type EmitValue = { id: number }
    const emitter = new Emitter<EmitValue>()

    observame<EmitValue>(emitter).pipe(map(v => ({ name: v.id }))).subscribe(v => {
      expect(v).toEqual({ name: 10 })
      resolve()
    })

    emitter.emit({ id: 10 })
  }))
})
