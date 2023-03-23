import { test, expect, describe } from 'vitest'

import { observame } from '../../observame'
import { Emitter } from '../../__tests__/helpers'
import { distinct } from '../distinct'

describe('Operators: distinct', () => {
  test("shouldn't emit two same values together", () => {
    type EmitValue = number
    const emitter = new Emitter<EmitValue>()

    const originalValues: EmitValue[] = []
    const obs = observame<EmitValue>(emitter)
    obs.subscribe(v => {
      originalValues.push(v)
    })

    const values: EmitValue[] = []
    obs.pipe(distinct())
      .subscribe(v => {
        values.push(v)
      })

    emitter.emit(0)
    emitter.emit(1)
    emitter.emit(1)
    emitter.emit(2)
    emitter.emit(2)
    emitter.emit(3)
    emitter.emit(4)
    emitter.emit(5)
    emitter.emit(4)

    expect(values.length).toEqual(7)
    expect(values).toEqual([0, 1, 2, 3, 4, 5, 4])
    expect(originalValues.length).toEqual(9)
    expect(originalValues).toEqual([0, 1, 1, 2, 2, 3, 4, 5, 4])
  })

  test("shouldn't emit two values with the same id together", () => {
    type EmitValue = {id: number}
    const emitter = new Emitter<EmitValue>()

    const obs = observame<EmitValue>(emitter)

    const originalValues: EmitValue[] = []
    obs.pipe(distinct())
      .subscribe(v => {
        originalValues.push(v)
      })

    const values: EmitValue[] = []
    obs.pipe(distinct((prev, current) => prev.id === current.id))
      .subscribe(v => {
        values.push(v)
      })

    emitter.emit({ id: 0 })
    emitter.emit({ id: 1 })
    emitter.emit({ id: 1 })
    emitter.emit({ id: 2 })
    emitter.emit({ id: 2 })
    emitter.emit({ id: 3 })
    emitter.emit({ id: 4 })
    emitter.emit({ id: 5 })
    emitter.emit({ id: 4 })

    expect(values.length).toEqual(7)
    expect(values).toEqual([
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 4 }
    ])
    expect(originalValues.length).toEqual(9)
    expect(originalValues).toEqual([
      { id: 0 },
      { id: 1 },
      { id: 1 },
      { id: 2 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 4 }
    ])
  })
})
