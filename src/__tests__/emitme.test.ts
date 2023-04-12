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

  test('should unsubscribe several subscriptions', () => {
    const emitme = new Emitme<number>()

    emitme.emit(0)

    const v1: number[] = []
    const v2: number[] = []
    const v3: number[] = []

    const s1 = emitme.subscribe(v => v1.push(v))
    const s2 = emitme.subscribe(v => v2.push(v))
    const s3 = emitme.subscribe(v => v3.push(v))

    emitme.emit(1)
    emitme.emit(2)

    s2.unsubscribe()
    emitme.emit(3)
    s3.unsubscribe()
    emitme.emit(4)
    s1.unsubscribe()
    emitme.emit(5)

    expect(v1).toEqual([1, 2, 3, 4])
    expect(v2).toEqual([1, 2])
    expect(v3).toEqual([1, 2, 3])
  })
})
