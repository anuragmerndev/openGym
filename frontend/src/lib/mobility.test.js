import { describe, it, expect } from 'vitest'
import { newMobilityItem, moveMobilityItem, toggleMobilityItem, mobilityOf, combinedMobility, sanitizeMobilityList } from './mobility.js'

describe('newMobilityItem', () => {
  it('trims fields and assigns an id', () => {
    const item = newMobilityItem(' Arm circles ', ' 15 each direction ', ' loosen the shoulders ')
    expect(item.name).toBe('Arm circles')
    expect(item.amount).toBe('15 each direction')
    expect(item.note).toBe('loosen the shoulders')
    expect(item.id).toBeTruthy()
  })
  it('defaults amount and note to empty strings', () => {
    const item = newMobilityItem('Cat-cow')
    expect(item.amount).toBe('')
    expect(item.note).toBe('')
  })
})

describe('moveMobilityItem', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  it('moves an item later', () => {
    expect(moveMobilityItem(list, 0, 2).map(x => x.id)).toEqual(['b', 'c', 'a'])
  })
  it('moves an item earlier', () => {
    expect(moveMobilityItem(list, 2, 0).map(x => x.id)).toEqual(['c', 'a', 'b'])
  })
  it('is a no-op past either end', () => {
    expect(moveMobilityItem(list, 0, -5).map(x => x.id)).toEqual(['a', 'b', 'c'])
    expect(moveMobilityItem(list, 2, 99).map(x => x.id)).toEqual(['a', 'b', 'c'])
  })
  it('leaves the input array untouched', () => {
    moveMobilityItem(list, 0, 2)
    expect(list.map(x => x.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('toggleMobilityItem', () => {
  it('checks an unchecked id and unchecks a checked one', () => {
    expect(toggleMobilityItem([], 'a')).toEqual(['a'])
    expect(toggleMobilityItem(['a', 'b'], 'a')).toEqual(['b'])
  })
  it('leaves the input array untouched', () => {
    const done = ['a']
    toggleMobilityItem(done, 'b')
    expect(done).toEqual(['a'])
  })
})

describe('mobilityOf', () => {
  it('returns the list for a key', () => {
    const r = { warmup: [{ id: 'a' }], cooldown: [] }
    expect(mobilityOf(r, 'warmup')).toEqual([{ id: 'a' }])
    expect(mobilityOf(r, 'cooldown')).toEqual([])
  })
  it('tolerates a missing key, a missing routine, or a non-array value', () => {
    expect(mobilityOf({}, 'warmup')).toEqual([])
    expect(mobilityOf(null, 'warmup')).toEqual([])
    expect(mobilityOf({ warmup: 'oops' }, 'warmup')).toEqual([])
  })
})

describe('combinedMobility', () => {
  it('concatenates lists in routine order', () => {
    const routines = [
      { id: 'r1', warmup: [{ id: 'a' }, { id: 'b' }] },
      { id: 'r2', warmup: [{ id: 'c' }] },
    ]
    expect(combinedMobility(routines, 'warmup').map(x => x.id)).toEqual(['a', 'b', 'c'])
  })
  it('skips routines with no list', () => {
    const routines = [{ id: 'r1' }, { id: 'r2', warmup: [{ id: 'a' }] }]
    expect(combinedMobility(routines, 'warmup').map(x => x.id)).toEqual(['a'])
  })
  it('tolerates an empty/missing routines argument', () => {
    expect(combinedMobility(undefined, 'warmup')).toEqual([])
    expect(combinedMobility([], 'warmup')).toEqual([])
  })
})

describe('sanitizeMobilityList', () => {
  it('coerces fields to trimmed strings and keeps a given id', () => {
    expect(sanitizeMobilityList([{ id: 'x1', name: ' Cat-cow ', amount: ' 10 reps ', note: ' slow ' }]))
      .toEqual([{ id: 'x1', name: 'Cat-cow', amount: '10 reps', note: 'slow' }])
  })
  it('assigns a fresh id when none is given', () => {
    const [item] = sanitizeMobilityList([{ name: 'Cat-cow' }])
    expect(item.id).toBeTruthy()
  })
  it('drops items with no name', () => {
    expect(sanitizeMobilityList([{ name: '' }, { amount: '10' }, 'nope', null, 42])).toEqual([])
  })
  it('tolerates a non-array input', () => {
    expect(sanitizeMobilityList(undefined)).toEqual([])
    expect(sanitizeMobilityList('oops')).toEqual([])
    expect(sanitizeMobilityList(null)).toEqual([])
  })
})
