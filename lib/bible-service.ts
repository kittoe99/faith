import { BibleBook, BibleVerse } from '../types/bible.types';

// Mock Bible books data (66 books of the Bible)
const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { abbrev: 'Gen', name: 'Genesis', bookid: 1, chapters: 50 },
  { abbrev: 'Exo', name: 'Exodus', bookid: 2, chapters: 40 },
  { abbrev: 'Lev', name: 'Leviticus', bookid: 3, chapters: 27 },
  { abbrev: 'Num', name: 'Numbers', bookid: 4, chapters: 36 },
  { abbrev: 'Deu', name: 'Deuteronomy', bookid: 5, chapters: 34 },
  { abbrev: 'Jos', name: 'Joshua', bookid: 6, chapters: 24 },
  { abbrev: 'Jdg', name: 'Judges', bookid: 7, chapters: 21 },
  { abbrev: 'Rut', name: 'Ruth', bookid: 8, chapters: 4 },
  { abbrev: '1Sa', name: '1 Samuel', bookid: 9, chapters: 31 },
  { abbrev: '2Sa', name: '2 Samuel', bookid: 10, chapters: 24 },
  { abbrev: '1Ki', name: '1 Kings', bookid: 11, chapters: 22 },
  { abbrev: '2Ki', name: '2 Kings', bookid: 12, chapters: 25 },
  { abbrev: '1Ch', name: '1 Chronicles', bookid: 13, chapters: 29 },
  { abbrev: '2Ch', name: '2 Chronicles', bookid: 14, chapters: 36 },
  { abbrev: 'Ezr', name: 'Ezra', bookid: 15, chapters: 10 },
  { abbrev: 'Neh', name: 'Nehemiah', bookid: 16, chapters: 13 },
  { abbrev: 'Est', name: 'Esther', bookid: 17, chapters: 10 },
  { abbrev: 'Job', name: 'Job', bookid: 18, chapters: 42 },
  { abbrev: 'Psa', name: 'Psalms', bookid: 19, chapters: 150 },
  { abbrev: 'Pro', name: 'Proverbs', bookid: 20, chapters: 31 },
  { abbrev: 'Ecc', name: 'Ecclesiastes', bookid: 21, chapters: 12 },
  { abbrev: 'Sol', name: 'Song of Solomon', bookid: 22, chapters: 8 },
  { abbrev: 'Isa', name: 'Isaiah', bookid: 23, chapters: 66 },
  { abbrev: 'Jer', name: 'Jeremiah', bookid: 24, chapters: 52 },
  { abbrev: 'Lam', name: 'Lamentations', bookid: 25, chapters: 5 },
  { abbrev: 'Eze', name: 'Ezekiel', bookid: 26, chapters: 48 },
  { abbrev: 'Dan', name: 'Daniel', bookid: 27, chapters: 12 },
  { abbrev: 'Hos', name: 'Hosea', bookid: 28, chapters: 14 },
  { abbrev: 'Joe', name: 'Joel', bookid: 29, chapters: 3 },
  { abbrev: 'Amo', name: 'Amos', bookid: 30, chapters: 9 },
  { abbrev: 'Oba', name: 'Obadiah', bookid: 31, chapters: 1 },
  { abbrev: 'Jon', name: 'Jonah', bookid: 32, chapters: 4 },
  { abbrev: 'Mic', name: 'Micah', bookid: 33, chapters: 7 },
  { abbrev: 'Nah', name: 'Nahum', bookid: 34, chapters: 3 },
  { abbrev: 'Hab', name: 'Habakkuk', bookid: 35, chapters: 3 },
  { abbrev: 'Zep', name: 'Zephaniah', bookid: 36, chapters: 3 },
  { abbrev: 'Hag', name: 'Haggai', bookid: 37, chapters: 2 },
  { abbrev: 'Zec', name: 'Zechariah', bookid: 38, chapters: 14 },
  { abbrev: 'Mal', name: 'Malachi', bookid: 39, chapters: 4 },
  
  // New Testament
  { abbrev: 'Mat', name: 'Matthew', bookid: 40, chapters: 28 },
  { abbrev: 'Mar', name: 'Mark', bookid: 41, chapters: 16 },
  { abbrev: 'Luk', name: 'Luke', bookid: 42, chapters: 24 },
  { abbrev: 'Joh', name: 'John', bookid: 43, chapters: 21 },
  { abbrev: 'Act', name: 'Acts', bookid: 44, chapters: 28 },
  { abbrev: 'Rom', name: 'Romans', bookid: 45, chapters: 16 },
  { abbrev: '1Co', name: '1 Corinthians', bookid: 46, chapters: 16 },
  { abbrev: '2Co', name: '2 Corinthians', bookid: 47, chapters: 13 },
  { abbrev: 'Gal', name: 'Galatians', bookid: 48, chapters: 6 },
  { abbrev: 'Eph', name: 'Ephesians', bookid: 49, chapters: 6 },
  { abbrev: 'Phi', name: 'Philippians', bookid: 50, chapters: 4 },
  { abbrev: 'Col', name: 'Colossians', bookid: 51, chapters: 4 },
  { abbrev: '1Th', name: '1 Thessalonians', bookid: 52, chapters: 5 },
  { abbrev: '2Th', name: '2 Thessalonians', bookid: 53, chapters: 3 },
  { abbrev: '1Ti', name: '1 Timothy', bookid: 54, chapters: 6 },
  { abbrev: '2Ti', name: '2 Timothy', bookid: 55, chapters: 4 },
  { abbrev: 'Tit', name: 'Titus', bookid: 56, chapters: 3 },
  { abbrev: 'Phm', name: 'Philemon', bookid: 57, chapters: 1 },
  { abbrev: 'Heb', name: 'Hebrews', bookid: 58, chapters: 13 },
  { abbrev: 'Jam', name: 'James', bookid: 59, chapters: 5 },
  { abbrev: '1Pe', name: '1 Peter', bookid: 60, chapters: 5 },
  { abbrev: '2Pe', name: '2 Peter', bookid: 61, chapters: 3 },
  { abbrev: '1Jo', name: '1 John', bookid: 62, chapters: 5 },
  { abbrev: '2Jo', name: '2 John', bookid: 63, chapters: 1 },
  { abbrev: '3Jo', name: '3 John', bookid: 64, chapters: 1 },
  { abbrev: 'Jud', name: 'Jude', bookid: 65, chapters: 1 },
  { abbrev: 'Rev', name: 'Revelation', bookid: 66, chapters: 22 },
];

/**
 * Get all Bible books
 */
export async function getBibleBooks(): Promise<BibleBook[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return BIBLE_BOOKS;
}

/**
 * Get a specific Bible chapter
 * Note: This is a mock implementation. In a real app, you would fetch from a Bible API
 */
export async function getBibleChapter(bookName: string, chapter: number): Promise<BibleVerse[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const book = BIBLE_BOOKS.find(b => b.name === bookName);
  if (!book) {
    throw new Error(`Book "${bookName}" not found`);
  }
  
  if (chapter < 1 || chapter > book.chapters) {
    throw new Error(`Chapter ${chapter} not found in ${bookName}`);
  }
  
  // Mock verses - in a real implementation, you'd fetch from a Bible API
  // For now, return placeholder verses
  const mockVerses: BibleVerse[] = [];
  const verseCount = getVerseCount(book.bookid, chapter);
  
  for (let i = 1; i <= verseCount; i++) {
    mockVerses.push({
      bookid: book.bookid,
      chapter: chapter,
      verse: i,
      text: `This is verse ${i} of ${bookName} chapter ${chapter}. To integrate with a real Bible API, replace this mock implementation with calls to services like Bible Gateway API, ESV API, or Bible.com API.`
    });
  }
  
  return mockVerses;
}

/**
 * Get approximate verse count for a chapter (simplified mock data)
 */
function getVerseCount(bookid: number, chapter: number): number {
  // This is a very simplified approximation
  // In a real app, you'd have exact verse counts
  if (bookid === 19) { // Psalms
    return Math.floor(Math.random() * 20) + 5; // 5-25 verses
  }
  if (bookid >= 20 && bookid <= 22) { // Proverbs, Ecclesiastes, Song of Solomon
    return Math.floor(Math.random() * 25) + 10; // 10-35 verses
  }
  if (bookid >= 40 && bookid <= 43) { // Gospels
    return Math.floor(Math.random() * 40) + 15; // 15-55 verses
  }
  
  // Default range for most books
  return Math.floor(Math.random() * 30) + 10; // 10-40 verses
}
