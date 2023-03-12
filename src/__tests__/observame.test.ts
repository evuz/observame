import { test, expect, describe, vi } from 'vitest'

import { Emitter } from './helpers'
import { observame } from '../observame'

describe('Observame', () => {
  test('should listen values', () => new Promise<void>(resolve => {
    const emitter = new Emitter<number>()

    observame<number>(emitter).subscribe(v => {
      expect(v).toBe(0)
      resolve()
    })

    emitter.emit(0)
  }))

  test('should multiples values', () => {
    const emitter = new Emitter<number>()

    const values: number[] = []
    observame<number>(emitter).subscribe(v => {
      values.push(v)
    })

    emitter.emit(0)
    emitter.emit(1)
    emitter.emit(2)
    emitter.emit(3)

    expect(values.length).toBe(4)
    expect(values).toEqual([0, 1, 2, 3])
  })

  test("shouldn't listen values before to subscribe", () => {
    const emitter = new Emitter<number>()

    emitter.emit(0)
    emitter.emit(1)

    const values: number[] = []
    observame<number>(emitter).subscribe(v => {
      values.push(v)
    })

    emitter.emit(2)
    emitter.emit(3)
    emitter.emit(4)

    expect(values.length).toBe(3)
    expect(values).toEqual([2, 3, 4])
  })

  test('should unsubscribe to emitter', () => {
    const unsubscribe = vi.fn()
    const emitter = new Emitter<number>(unsubscribe)

    const values: number[] = []
    const subscription = observame<number>(emitter).subscribe(v => {
      values.push(v)
    })

    emitter.emit(2)
    emitter.emit(3)
    emitter.emit(4)

    expect(values.length).toBe(3)
    expect(values).toEqual([2, 3, 4])

    subscription.unsubscribe()
    expect(unsubscribe).toBeCalled()
  })

  describe('pipe', () => {
    test('should apply the operator', () => new Promise<void>(resolve => {
      const emitter = new Emitter<number>()
      const operatorFn = vi.fn()

      emitter.emit(0)
      emitter.emit(1)

      const obs = observame<number>(emitter).pipe(next => (v) => {
        operatorFn()
        next(v)
      })

      emitter.emit(1)

      obs.subscribe(v => {
        expect(v).toBe(2)
        expect(operatorFn).toBeCalledTimes(1)
        resolve()
      })

      emitter.emit(2)
    }))

    test('should create a new subscribable', () => {
      const emitter = new Emitter<number>()
      const operatorFn = vi.fn()

      emitter.emit(0)
      emitter.emit(1)

      const values: number[] = []
      const obs = observame<number>(emitter)
      const obs1 = obs.pipe((next) => (v) => {
        operatorFn()
        next(v)
      })

      obs.subscribe(v => values.push(v))
      obs1.subscribe(v => values.push(v as number))

      emitter.emit(1)
      emitter.emit(2)

      expect(operatorFn).toBeCalledTimes(2)
      expect(values.length).toEqual(4)
    })

    test('should unsubscribe to emitter', () => {
      const unsubscribe = vi.fn()
      const emitter = new Emitter<number>(unsubscribe)
      const operatorFn = vi.fn()

      emitter.emit(0)
      emitter.emit(1)

      const values: number[] = []
      const obs = observame<number>(emitter)
      const obs1 = obs.pipe((next) => (v) => {
        operatorFn()
        next(v)
      })

      const s = obs.subscribe(v => values.push(v))
      const s1 = obs1.subscribe(v => values.push(v as number))

      emitter.emit(1)
      emitter.emit(2)

      expect(operatorFn).toBeCalledTimes(2)
      expect(values.length).toEqual(4)

      s.unsubscribe()
      s1.unsubscribe()

      expect(unsubscribe).toBeCalledTimes(2)
    })
  })
})
