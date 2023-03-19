import { test, expect, describe, vi } from 'vitest'

import { observame } from '../../observame'
import { Emitter } from '../../__tests__/helpers'
import { until } from '../until'

describe('Operators: until', () => {
  test('should take only first three values', () => {
    type EmitValue = number
    let alive = true
    const unsubscribe = vi.fn(() => {
      alive = false
    })
    const emitter = new Emitter<EmitValue>(unsubscribe)
    const stop = new Emitter<void>()

    const values: EmitValue[] = []
    observame<EmitValue>(emitter)
      .pipe(until(stop))
      .subscribe(v => {
        if (alive) {
          values.push(v)
        }
      })

    emitter.emit(0)
    emitter.emit(1)
    emitter.emit(2)

    stop.emit()

    emitter.emit(3)
    emitter.emit(4)
    emitter.emit(5)

    expect(values.length).toEqual(3)
    expect(values).toEqual([0, 1, 2])
    expect(unsubscribe).toBeCalledTimes(1)
  })

  test.only('should unsubscribe of the source', () => {
    type EmitValue = number
    const unsubscribe = vi.fn()
    const emitter = new Emitter<EmitValue>()
    const stop = new Emitter<void>(unsubscribe)

    observame<EmitValue>(emitter)
      .pipe(until(stop))
      .subscribe(() => {})

    stop.emit()

    expect(unsubscribe).toBeCalledTimes(1)
  })

  test('should unsubscribe the source when subscription ends', () => {
    type EmitValue = number
    const unsubscribe = vi.fn()
    const emitter = new Emitter<EmitValue>()
    const stop = new Emitter<void>(unsubscribe)

    const obs = observame<EmitValue>(emitter)
      .pipe(until(stop))
      .subscribe(() => {})

    expect(unsubscribe).toBeCalledTimes(0)

    obs.unsubscribe()
    expect(unsubscribe).toBeCalledTimes(1)
  })
})
