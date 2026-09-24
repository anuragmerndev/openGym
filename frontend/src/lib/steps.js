// Daily step count — one entry per calendar date, modeled directly on body weight
// (S.bodyweight, see lib/history.js's lastBW / sheets.jsx's BwSheet): the same
// { d: iso, n, t } shape bodyweight uses ({ d, w, t }), upserted by date, sorted by date.
// Kept as its own file rather than folded into history.js/progression.js — steps are not
// training data and nothing here should ever be reached from that side of the app.

// The most recent entry, or null with nothing logged yet.
export const lastSteps = S => {
  const list = S.steps || []
  return list.length ? list[list.length - 1] : null
}

// The entry for one calendar date, or null.
export const stepsOn = (S, iso) => (S.steps || []).find(e => e.d === iso) || null

// Upserts `n` steps for `iso` into `list`, returning a new sorted array — the input is left
// alone. Pure so the upsert (same shape as BwSheet's bodyweight save) is testable apart from
// the store.
export function logSteps(list = [], iso, n, t = Date.now()) {
  const next = [...list]
  const i = next.findIndex(e => e.d === iso)
  if (i === -1) next.push({ d: iso, n, t })
  else next[i] = { ...next[i], n, t }
  next.sort((a, b) => (a.d < b.d ? -1 : 1))
  return next
}

// Removes the entry for one date, returning a new array.
export const removeSteps = (list = [], iso) => list.filter(e => e.d !== iso)
