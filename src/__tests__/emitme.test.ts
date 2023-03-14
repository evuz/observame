import { test, expect, describe, vi } from 'vitest'

import { Emitme } from '../emitme'

describe('Emitme', () => {
  test('should emit values', () => new Promise<void>(resolve => {
    const emitme = new Emitme<number>()

    emitme.subscribe(v => {
      expect(v).toBe(0)
      resolve()
    })

    emitme.emit(0)
  }))

  test('should emit multiples values', () => {
    const emitme = new Emitme<number>()

    const values: number[] = []
    emitme.subscribe(v => {
      values.push(v)
    })

    emitme.emit(0)
    emitme.emit(1)
    emitme.emit(2)
    emitme.emit(3)

    expect(values.length).toBe(4)
    expect(values).toEqual([0, 1, 2, 3])
  })

  test("shouldn't listen values before to subscribe", () => {
    const emitme = new Emitme<number>()

    emitme.emit(0)
    emitme.emit(1)

    const values: number[] = []
    emitme.subscribe(v => {
      values.push(v)
    })

    emitme.emit(2)
    emitme.emit(3)
    emitme.emit(4)

    expect(values.length).toBe(3)
    expect(values).toEqual([2, 3, 4])
  })

  test('should unsubscribe to emitter', () => {
    const fn = vi.fn()
    const emitme = new Emitme<number>()

    const values: number[] = []
    const subscription = emitme.subscribe(v => {
      fn()
      values.push(v)
    })

    emitme.emit(2)
    emitme.emit(3)

    subscription.unsubscribe()

    emitme.emit(4)

    expect(values.length).toBe(2)
    expect(values).toEqual([2, 3])

    expect(fn).toBeCalledTimes(2)
  })
})
