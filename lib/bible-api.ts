export interface Verse {
  reference: string
  text: string
}

/**
 * Fetches passage text from the free bible-api.com service.
 * Accepts references like "John 3:16" or "Genesis 1".
 */
export async function fetchPassage(reference: string, translation = 'kjv'): Promise<Verse[]> {
  const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Unable to fetch scripture')
  const data = await res.json()
  return (data.verses as any[]).map((v) => ({ reference: `${v.book_name} ${v.chapter}:${v.verse}`, text: v.text.trim() }))
}
