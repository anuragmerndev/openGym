// Warm-up and cool-down lists attached to a routine — the mobility work around a session
// (arm circles, cat-cow, band pull-aparts…), not the ramp-up SETS a lift already has (that is
// `phase: 'warmup'` on a set row, see lib/workout-model.js's phaseForSet — a different thing).
//
// A routine holds two independent lists, `warmup` and `cooldown`, each an ordered array of
//   { id, name, amount, note }
// — `amount` is free text ("15 each direction", "30s each arm"), never a number/unit pair, and
// `note` is optional. Deliberately NOT sets: nothing here ever reaches entry.sets, so nothing
// here can be read by workoutVolume, setTonnage, estimate1RM, progression, recovery or
// muscles.js. A routine saved before this feature existed simply has no `warmup`/`cooldown` key
// — every reader here (and everywhere this is consumed) treats a missing or non-array list as
// empty, no migration needed.
import { uid } from './format.js'

export function newMobilityItem(name, amount = '', note = '') {
  return { id: uid(), name: name.trim(), amount: amount.trim(), note: note.trim() }
}

// Move the item at `from` to sit at index `to`, returning a new array — the input is left
// alone. Same shape as CheckIn.jsx's moveGymCard / lib/supplements.js's moveSupplement: an
// out-of-range or no-op move returns an unchanged copy rather than throwing.
export function moveMobilityItem(list, from, to) {
  const next = [...list]
  if (from < 0 || from >= next.length) return next
  const target = Math.max(0, Math.min(to, next.length - 1))
  if (target === from) return next
  const [moved] = next.splice(from, 1)
  next.splice(target, 0, moved)
  return next
}

// Toggles `id` within a checked-off list (the guided workout's tick state), returning a new
// array — the input untouched.
export function toggleMobilityItem(doneIds = [], id) {
  const set = new Set(doneIds)
  if (set.has(id)) set.delete(id); else set.add(id)
  return [...set]
}

// One routine's list for `key` ('warmup' | 'cooldown'), tolerating a routine with no such key
// (or any other shape a hand-edited/legacy file might carry) — never throws, never returns
// anything but an array.
export const mobilityOf = (routine, key) => (Array.isArray(routine?.[key]) ? routine[key] : [])

// The combined warm-up/cool-down across every routine in a (possibly multi-routine) session,
// in routine order then item order. A routine with no list, or an empty one, contributes
// nothing.
export const combinedMobility = (routines, key) => (routines || []).flatMap(r => mobilityOf(r, key))

// Sanitizes a warm-up/cool-down list coming from an untrusted source (an imported plan file):
// keeps only plausibly-shaped items and coerces every field to a trimmed string, dropping
// anything without a name. Used by lib/plan-share.js so a hand-edited or foreign file can
// never hand a routine a list this app's own readers don't expect.
export function sanitizeMobilityList(list) {
  if (!Array.isArray(list)) return []
  return list
    .map(item => (item && typeof item === 'object' ? item : null))
    .filter(Boolean)
    .map(item => ({
      id: typeof item.id === 'string' && item.id ? item.id : uid(),
      name: String(item.name ?? '').trim(),
      amount: String(item.amount ?? '').trim(),
      note: String(item.note ?? '').trim(),
    }))
    .filter(item => item.name)
}
