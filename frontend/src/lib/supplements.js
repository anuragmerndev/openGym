// A user-defined list of supplements (Settings) plus which of them are checked off on a
// given calendar date (Home). No stock library and no reminders — just a name, an optional
// dose and an optional "when" note that the user typed in themselves.
//   S.supplements    [{ id, name, dose, when }], in display order
//   S.supplementLog  { [iso]: [supplementId, …] } — ids checked on that date
import { uid } from './format.js'

export function newSupplement(name, dose = '', when = '') {
  return { id: uid(), name: name.trim(), dose: dose.trim(), when: when.trim() }
}

// Move the item at `from` to sit at index `to`, returning a new array — the input is left
// alone. Same shape as CheckIn.jsx's moveGymCard: an out-of-range or no-op move returns an
// unchanged copy rather than throwing, so a reorder button at either end is simply inert.
export function moveSupplement(list, from, to) {
  const next = [...list]
  if (from < 0 || from >= next.length) return next
  const target = Math.max(0, Math.min(to, next.length - 1))
  if (target === from) return next
  const [moved] = next.splice(from, 1)
  next.splice(target, 0, moved)
  return next
}

// Toggles `id` within one date's checked list, returning a new array — the input untouched.
export function toggleSupplement(doneIds = [], id) {
  const set = new Set(doneIds)
  if (set.has(id)) set.delete(id); else set.add(id)
  return [...set]
}

// The supplement list for one calendar date, in order, each with its `done` state for that
// date. A supplement removed from S.supplements simply stops appearing — its past log entries
// (if any) are harmless orphan ids, never surfaced.
export function supplementsFor(S, iso) {
  const list = S.supplements || []
  const done = new Set((S.supplementLog && S.supplementLog[iso]) || [])
  return list.map(s => ({ ...s, done: done.has(s.id) }))
}
