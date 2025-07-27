import { BibleVerse, BibleBook } from '../types/bible.types';

// Using GetBible.net API which is free and doesn't require an API key
const API_BASE_URL = 'https://bible-api.com';

// Default version is KJV (King James Version)
const DEFAULT_VERSION = 'kjv';

/**
 * Fetch list of Bible books
 */
// Static list of Bible books with chapter counts (abbreviated for brevity; add all as needed)
const BOOKS: BibleBook[] = [
  { bookid: 1, abbrev: 'Gen', name: 'Genesis', chapters: 50 },
  { bookid: 2, abbrev: 'Exo', name: 'Exodus', chapters: 40 },
  { bookid: 3, abbrev: 'Lev', name: 'Leviticus', chapters: 27 },
  { bookid: 4, abbrev: 'Num', name: 'Numbers', chapters: 36 },
  { bookid: 5, abbrev: 'Deu', name: 'Deuteronomy', chapters: 34 },
  // ... add remaining books ...
];

export async function getBibleBooks(): Promise<BibleBook[]> {
  // Bible-API does not provide a book list endpoint, so we use the static list above.
  return BOOKS;
}

/**
 * Fetch a specific Bible chapter
 */
export async function getBibleChapter(
  bookName: string,
  chapterId: number
): Promise<BibleVerse[]> {
  try {
    const url = `${API_BASE_URL}/${encodeURIComponent(`${bookName} ${chapterId}`)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Bible chapter: ${response.status}`);
    }
    const data = await response.json();
    // bible-api returns verses array
    return data.verses || [];
  } catch (error) {
    console.error('Error fetching Bible chapter:', error);
    return [];
  }
}

/**
 * Fetch a specific Bible verse
 */
export async function getBibleVerse(
  bookName: string,
  chapterId: number,
  verseId: number
): Promise<BibleVerse | null> {
  try {
    const verses = await getBibleChapter(bookName, chapterId);
    const verse = verses.find(v => v.verse == verseId);
    return verse || null;
  } catch (error) {
    console.error('Error fetching Bible verse:', error);
    return null;
  }
}

/**
 * Search for Bible verses by keyword
 */
export async function searchBible(
  query: string,
  version: string = DEFAULT_VERSION
): Promise<any> {
  // Bible-API offers simple search via query param `?q=` but results are very limited.
  // Placeholder for future search implementation.
  console.warn('Search functionality not implemented for Bible-API');
  return [];
}
