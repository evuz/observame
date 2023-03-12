import { test, expect, describe } from 'vitest'

import { observame } from '../../observame'
import { Emitter } from '../../__tests__/helpers'
import { filter } from '../filter'

describe('Operators: filter', () => {
  test('should filter strings', () => new Promise<void>(resolve => {
    type EmitValue = number | string
    const emitter = new Emitter<EmitValue>()

    const values: EmitValue[] = []
    observame<EmitValue>(emitter)
      .pipe(filter(v => typeof v === 'number'))
      .subscribe(v => {
        values.push(v)

        if (values.length === 3) {
          expect(values).toEqual([0, 2, 3])
          resolve()
        }
      })

    emitter.emit(0)
    emitter.emit('1')
    emitter.emit(2)
    emitter.emit(3)
    emitter.emit('4')
  }))

  test('should filter the object without id', () => new Promise<void>(resolve => {
      type EmitValue = { name: number } | { id: number }
      const emitter = new Emitter<EmitValue>()

      const values: EmitValue[] = []
      observame<EmitValue>(emitter)
        .pipe(filter(v => (<any>v).id !== undefined))
        .subscribe(v => {
          values.push(v)

          if (values.length === 3) {
            expect(values).toEqual([{ id: 10 }, { id: 20 }, { id: 30 }])
            resolve()
          }
        })

      emitter.emit({ name: 0 })
      emitter.emit({ id: 10 })
      emitter.emit({ id: 20 })
      emitter.emit({ id: 30 })
  }))
})
