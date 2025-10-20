import { guessType } from './guess-type'

export const inferColumns = (rows: Record<string, any>[]) => {
  const keys = Object.keys(rows[0] ?? {})
  return keys.map(name => ({
    name,
    type: guessType(rows.map(r => r?.[name])),
  }))
}
