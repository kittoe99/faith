export interface BibleBook {
  abbrev: string;
  name: string;
  bookid: number;
  chapters: number;
}

export interface BibleVerse {
  bookid: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  bookid: number;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleVersion {
  version: string;
  title: string;
  description: string;
  lang: string;
  lang_short: string;
  dir: string;
}
