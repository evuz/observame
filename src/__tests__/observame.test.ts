import { test, expect, describe } from 'vitest'

import { observame } from '../observame'

describe('Observame', () => {
  test('should sum', () => {
    const r = observame(3, 5)
    expect(r).toBe(8)
  })
})
