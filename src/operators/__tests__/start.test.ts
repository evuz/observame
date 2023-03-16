import { test, expect, describe } from 'vitest'

import { observame } from '../../observame'
import { Emitter } from '../../__tests__/helpers'
import { start } from '../start'

describe('Operators: start', () => {
  test('should init the subscribable', () => {
    const emitter = new Emitter<number>()

    const values: number[] = []
    observame<number>(emitter).pipe(start(10)).subscribe(v => {
      values.push(v)
    })

    expect(values).toEqual([10])
  })

  test('should emit other values', () => {
    const emitter = new Emitter<number>()

    const values: number[] = []
    observame<number>(emitter).pipe(start(10)).subscribe(v => {
      values.push(v)
    })

    emitter.emit(20)
    emitter.emit(30)

    expect(values).toEqual([10, 20, 30])
  })
})
