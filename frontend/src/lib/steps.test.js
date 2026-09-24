import { describe, it, expect } from 'vitest'
import { lastSteps, stepsOn, logSteps, removeSteps } from './steps.js'

describe('lastSteps', () => {
  it('returns null with no entries', () => {
    expect(lastSteps({ steps: [] })).toBeNull()
    expect(lastSteps({})).toBeNull()
  })
  it('returns the last entry', () => {
    const S = { steps: [{ d: '2024-01-01', n: 4000, t: 1 }, { d: '2024-01-02', n: 8000, t: 2 }] }
    expect(lastSteps(S).n).toBe(8000)
  })
})

describe('stepsOn', () => {
  it('finds the entry for a date', () => {
    const S = { steps: [{ d: '2024-01-01', n: 4000, t: 1 }] }
    expect(stepsOn(S, '2024-01-01').n).toBe(4000)
    expect(stepsOn(S, '2024-01-02')).toBeNull()
  })
  it('tolerates missing steps array', () => {
    expect(stepsOn({}, '2024-01-01')).toBeNull()
  })
})

describe('logSteps', () => {
  it('adds a new entry, sorted by date', () => {
    const out = logSteps([{ d: '2024-01-02', n: 5000, t: 1 }], '2024-01-01', 3000, 2)
    expect(out).toEqual([{ d: '2024-01-01', n: 3000, t: 2 }, { d: '2024-01-02', n: 5000, t: 1 }])
  })
  it('updates the existing entry for the same date instead of duplicating it', () => {
    const out = logSteps([{ d: '2024-01-01', n: 3000, t: 1 }], '2024-01-01', 9000, 2)
    expect(out).toEqual([{ d: '2024-01-01', n: 9000, t: 2 }])
  })
  it('leaves the input array untouched', () => {
    const list = [{ d: '2024-01-01', n: 3000, t: 1 }]
    logSteps(list, '2024-01-01', 9000, 2)
    expect(list[0].n).toBe(3000)
  })
  it('defaults to an empty list', () => {
    expect(logSteps(undefined, '2024-01-01', 1000, 1)).toEqual([{ d: '2024-01-01', n: 1000, t: 1 }])
  })
})

describe('removeSteps', () => {
  it('drops the entry for a date', () => {
    const list = [{ d: '2024-01-01', n: 1 }, { d: '2024-01-02', n: 2 }]
    expect(removeSteps(list, '2024-01-01')).toEqual([{ d: '2024-01-02', n: 2 }])
  })
})
