import { describe, it, expect } from 'vitest'
import { newSupplement, moveSupplement, toggleSupplement, supplementsFor } from './supplements.js'

describe('newSupplement', () => {
  it('trims fields and assigns an id', () => {
    const s = newSupplement(' Creatine ', ' 5g ', ' Morning ')
    expect(s.name).toBe('Creatine')
    expect(s.dose).toBe('5g')
    expect(s.when).toBe('Morning')
    expect(s.id).toBeTruthy()
  })
  it('defaults dose and when to empty strings', () => {
    const s = newSupplement('Vitamin D')
    expect(s.dose).toBe('')
    expect(s.when).toBe('')
  })
})

describe('moveSupplement', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  it('moves an item later', () => {
    expect(moveSupplement(list, 0, 2).map(x => x.id)).toEqual(['b', 'c', 'a'])
  })
  it('moves an item earlier', () => {
    expect(moveSupplement(list, 2, 0).map(x => x.id)).toEqual(['c', 'a', 'b'])
  })
  it('is a no-op past either end', () => {
    expect(moveSupplement(list, 0, -5).map(x => x.id)).toEqual(['a', 'b', 'c'])
    expect(moveSupplement(list, 2, 99).map(x => x.id)).toEqual(['a', 'b', 'c'])
  })
  it('is a no-op for an out-of-range from', () => {
    expect(moveSupplement(list, -1, 1)).toEqual(list)
    expect(moveSupplement(list, 5, 1)).toEqual(list)
  })
  it('leaves the input array untouched', () => {
    moveSupplement(list, 0, 2)
    expect(list.map(x => x.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('toggleSupplement', () => {
  it('checks an unchecked id', () => {
    expect(toggleSupplement([], 'a')).toEqual(['a'])
  })
  it('unchecks a checked id', () => {
    expect(toggleSupplement(['a', 'b'], 'a')).toEqual(['b'])
  })
  it('leaves the input array untouched', () => {
    const done = ['a']
    toggleSupplement(done, 'b')
    expect(done).toEqual(['a'])
  })
})

describe('supplementsFor', () => {
  const S = {
    supplements: [{ id: 'a', name: 'Creatine' }, { id: 'b', name: 'Vitamin D' }],
    supplementLog: { '2024-01-01': ['b'] },
  }
  it('marks done state per date, in list order', () => {
    expect(supplementsFor(S, '2024-01-01')).toEqual([
      { id: 'a', name: 'Creatine', done: false },
      { id: 'b', name: 'Vitamin D', done: true },
    ])
  })
  it('is all-undone for a date with no log entry', () => {
    expect(supplementsFor(S, '2024-01-02').every(s => !s.done)).toBe(true)
  })
  it('tolerates missing supplements/supplementLog', () => {
    expect(supplementsFor({}, '2024-01-01')).toEqual([])
  })
})
