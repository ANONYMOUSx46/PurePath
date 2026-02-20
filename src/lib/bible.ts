// Bible API service with offline caching support
// Fallback to API.Bible for more features

import { bibleCache } from './bibleCache'

export interface BibleVerse {
  reference: string
  text: string
  translation: string
}

export interface BibleChapter {
  reference: string
  verses: Array<{
    verse: number
    text: string
  }>
  translation: string
}

export interface BibleBook {
  name: string
  chapters: number
  testament: 'Old' | 'New'
  abbrev: string
}

// List of all Bible books
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { name: 'Genesis', chapters: 50, testament: 'Old', abbrev: 'gen' },
  { name: 'Exodus', chapters: 40, testament: 'Old', abbrev: 'exod' },
  { name: 'Leviticus', chapters: 27, testament: 'Old', abbrev: 'lev' },
  { name: 'Numbers', chapters: 36, testament: 'Old', abbrev: 'num' },
  { name: 'Deuteronomy', chapters: 34, testament: 'Old', abbrev: 'deut' },
  { name: 'Joshua', chapters: 24, testament: 'Old', abbrev: 'josh' },
  { name: 'Judges', chapters: 21, testament: 'Old', abbrev: 'judg' },
  { name: 'Ruth', chapters: 4, testament: 'Old', abbrev: 'ruth' },
  { name: '1 Samuel', chapters: 31, testament: 'Old', abbrev: '1sam' },
  { name: '2 Samuel', chapters: 24, testament: 'Old', abbrev: '2sam' },
  { name: '1 Kings', chapters: 22, testament: 'Old', abbrev: '1kgs' },
  { name: '2 Kings', chapters: 25, testament: 'Old', abbrev: '2kgs' },
  { name: '1 Chronicles', chapters: 29, testament: 'Old', abbrev: '1chr' },
  { name: '2 Chronicles', chapters: 36, testament: 'Old', abbrev: '2chr' },
  { name: 'Ezra', chapters: 10, testament: 'Old', abbrev: 'ezra' },
  { name: 'Nehemiah', chapters: 13, testament: 'Old', abbrev: 'neh' },
  { name: 'Esther', chapters: 10, testament: 'Old', abbrev: 'esth' },
  { name: 'Job', chapters: 42, testament: 'Old', abbrev: 'job' },
  { name: 'Psalms', chapters: 150, testament: 'Old', abbrev: 'ps' },
  { name: 'Proverbs', chapters: 31, testament: 'Old', abbrev: 'prov' },
  { name: 'Ecclesiastes', chapters: 12, testament: 'Old', abbrev: 'eccl' },
  { name: 'Song of Solomon', chapters: 8, testament: 'Old', abbrev: 'song' },
  { name: 'Isaiah', chapters: 66, testament: 'Old', abbrev: 'isa' },
  { name: 'Jeremiah', chapters: 52, testament: 'Old', abbrev: 'jer' },
  { name: 'Lamentations', chapters: 5, testament: 'Old', abbrev: 'lam' },
  { name: 'Ezekiel', chapters: 48, testament: 'Old', abbrev: 'ezek' },
  { name: 'Daniel', chapters: 12, testament: 'Old', abbrev: 'dan' },
  { name: 'Hosea', chapters: 14, testament: 'Old', abbrev: 'hos' },
  { name: 'Joel', chapters: 3, testament: 'Old', abbrev: 'joel' },
  { name: 'Amos', chapters: 9, testament: 'Old', abbrev: 'amos' },
  { name: 'Obadiah', chapters: 1, testament: 'Old', abbrev: 'obad' },
  { name: 'Jonah', chapters: 4, testament: 'Old', abbrev: 'jonah' },
  { name: 'Micah', chapters: 7, testament: 'Old', abbrev: 'mic' },
  { name: 'Nahum', chapters: 3, testament: 'Old', abbrev: 'nah' },
  { name: 'Habakkuk', chapters: 3, testament: 'Old', abbrev: 'hab' },
  { name: 'Zephaniah', chapters: 3, testament: 'Old', abbrev: 'zeph' },
  { name: 'Haggai', chapters: 2, testament: 'Old', abbrev: 'hag' },
  { name: 'Zechariah', chapters: 14, testament: 'Old', abbrev: 'zech' },
  { name: 'Malachi', chapters: 4, testament: 'Old', abbrev: 'mal' },
  // New Testament
  { name: 'Matthew', chapters: 28, testament: 'New', abbrev: 'matt' },
  { name: 'Mark', chapters: 16, testament: 'New', abbrev: 'mark' },
  { name: 'Luke', chapters: 24, testament: 'New', abbrev: 'luke' },
  { name: 'John', chapters: 21, testament: 'New', abbrev: 'john' },
  { name: 'Acts', chapters: 28, testament: 'New', abbrev: 'acts' },
  { name: 'Romans', chapters: 16, testament: 'New', abbrev: 'rom' },
  { name: '1 Corinthians', chapters: 16, testament: 'New', abbrev: '1cor' },
  { name: '2 Corinthians', chapters: 13, testament: 'New', abbrev: '2cor' },
  { name: 'Galatians', chapters: 6, testament: 'New', abbrev: 'gal' },
  { name: 'Ephesians', chapters: 6, testament: 'New', abbrev: 'eph' },
  { name: 'Philippians', chapters: 4, testament: 'New', abbrev: 'phil' },
  { name: 'Colossians', chapters: 4, testament: 'New', abbrev: 'col' },
  { name: '1 Thessalonians', chapters: 5, testament: 'New', abbrev: '1thess' },
  { name: '2 Thessalonians', chapters: 3, testament: 'New', abbrev: '2thess' },
  { name: '1 Timothy', chapters: 6, testament: 'New', abbrev: '1tim' },
  { name: '2 Timothy', chapters: 4, testament: 'New', abbrev: '2tim' },
  { name: 'Titus', chapters: 3, testament: 'New', abbrev: 'titus' },
  { name: 'Philemon', chapters: 1, testament: 'New', abbrev: 'phlm' },
  { name: 'Hebrews', chapters: 13, testament: 'New', abbrev: 'heb' },
  { name: 'James', chapters: 5, testament: 'New', abbrev: 'jas' },
  { name: '1 Peter', chapters: 5, testament: 'New', abbrev: '1pet' },
  { name: '2 Peter', chapters: 3, testament: 'New', abbrev: '2pet' },
  { name: '1 John', chapters: 5, testament: 'New', abbrev: '1john' },
  { name: '2 John', chapters: 1, testament: 'New', abbrev: '2john' },
  { name: '3 John', chapters: 1, testament: 'New', abbrev: '3john' },
  { name: 'Jude', chapters: 1, testament: 'New', abbrev: 'jude' },
  { name: 'Revelation', chapters: 22, testament: 'New', abbrev: 'rev' },
]

class BibleService {
  private baseURL = 'https://bible-api.com'

  // Fetch a specific verse or passage with offline caching
  async getVerse(reference: string): Promise<BibleVerse | null> {
    const cacheKey = `verse-${reference.toLowerCase().replace(/\s+/g, '-')}`
    
    try {
      // Try cache first for offline support
      const cached = await bibleCache.get(cacheKey)
      if (cached) {
        console.log('[Bible] Serving cached verse:', reference)
        return cached
      }

      // Fetch from network
      const response = await fetch(`${this.baseURL}/${encodeURIComponent(reference)}`)
      if (!response.ok) throw new Error('Verse not found')
      
      const data = await response.json()
      const verse: BibleVerse = {
        reference: data.reference,
        text: data.text.trim(),
        translation: data.translation_name || 'KJV',
      }

      // Cache for offline use
      await bibleCache.set(cacheKey, verse)
      
      return verse
    } catch (error) {
      console.error('Error fetching verse:', error)
      
      // Try cache as fallback
      const cached = await bibleCache.get(cacheKey)
      if (cached) {
        console.log('[Bible] Network failed, serving cached verse:', reference)
        return cached
      }
      
      return null
    }
  }

  // Fetch an entire chapter with offline caching
  async getChapter(book: string, chapter: number): Promise<BibleChapter | null> {
    const cacheKey = `chapter-${book.toLowerCase().replace(/\s+/g, '-')}-${chapter}`
    
    try {
      // Try cache first for offline support
      const cached = await bibleCache.get(cacheKey)
      if (cached) {
        console.log('[Bible] Serving cached chapter:', book, chapter)
        return cached
      }

      // Fetch from network
      const reference = `${book} ${chapter}`
      const response = await fetch(`${this.baseURL}/${encodeURIComponent(reference)}`)
      if (!response.ok) throw new Error('Chapter not found')
      
      const data = await response.json()
      
      // Parse verses
      const verses = data.verses.map((v: any) => ({
        verse: v.verse,
        text: v.text.trim(),
      }))

      const chapterData: BibleChapter = {
        reference: data.reference,
        verses,
        translation: data.translation_name || 'KJV',
      }

      // Cache for offline use
      await bibleCache.set(cacheKey, chapterData)

      return chapterData
    } catch (error) {
      console.error('Error fetching chapter:', error)
      
      // Try cache as fallback
      const cached = await bibleCache.get(cacheKey)
      if (cached) {
        console.log('[Bible] Network failed, serving cached chapter:', book, chapter)
        return cached
      }
      
      return null
    }
  }

  // Get random verse
  async getRandomVerse(): Promise<BibleVerse | null> {
    // Popular encouraging verses
    const verses = [
      'Philippians 4:13',
      'Jeremiah 29:11',
      'Psalm 23:1-3',
      'Romans 8:28',
      'Proverbs 3:5-6',
      'Isaiah 41:10',
      'Matthew 11:28-30',
      'John 3:16',
      'Psalm 46:1',
      'Joshua 1:9',
      '2 Corinthians 5:17',
      'Ephesians 2:8-9',
      'Romans 12:2',
      'Psalm 119:105',
      'Proverbs 16:3',
    ]
    
    const randomVerse = verses[Math.floor(Math.random() * verses.length)]
    return this.getVerse(randomVerse)
  }

  // Search for verses containing keywords
  async searchVerses(keyword: string): Promise<BibleVerse[]> {
    // Note: bible-api.com doesn't support search
    // For a production app, use API.Bible which has search
    // For now, we'll return some common verses related to keywords
    const searchMap: Record<string, string[]> = {
      love: ['1 Corinthians 13:4-8', 'John 3:16', '1 John 4:8'],
      hope: ['Romans 15:13', 'Jeremiah 29:11', 'Hebrews 11:1'],
      faith: ['Hebrews 11:1', 'Romans 10:17', 'James 2:26'],
      peace: ['John 14:27', 'Philippians 4:6-7', 'Romans 5:1'],
      strength: ['Philippians 4:13', 'Isaiah 40:31', 'Psalm 46:1'],
      joy: ['Nehemiah 8:10', 'Psalm 16:11', 'John 15:11'],
      forgiveness: ['Ephesians 4:32', '1 John 1:9', 'Colossians 3:13'],
      prayer: ['1 Thessalonians 5:17', 'Philippians 4:6', 'Matthew 6:9-13'],
    }

    const results: BibleVerse[] = []
    const lowerKeyword = keyword.toLowerCase()
    
    for (const [key, verses] of Object.entries(searchMap)) {
      if (key.includes(lowerKeyword) || lowerKeyword.includes(key)) {
        for (const verseRef of verses) {
          const verse = await this.getVerse(verseRef)
          if (verse) results.push(verse)
        }
        break
      }
    }

    return results
  }

  // Check if we're online
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }

  // Preload commonly read chapters for offline use
  async preloadPopularChapters(): Promise<void> {
    const popularChapters = [
      { book: 'John', chapter: 3 },
      { book: 'Psalm', chapter: 23 },
      { book: 'Romans', chapter: 8 },
      { book: 'Matthew', chapter: 5 },
      { book: 'John', chapter: 1 },
      { book: 'Philippians', chapter: 4 },
      { book: '1 Corinthians', chapter: 13 },
      { book: 'Genesis', chapter: 1 },
      { book: 'Proverbs', chapter: 3 },
      { book: 'Isaiah', chapter: 53 },
    ]

    console.log('[Bible] Preloading popular chapters for offline use...')
    
    for (const { book, chapter } of popularChapters) {
      try {
        await this.getChapter(book, chapter)
      } catch (error) {
        console.error(`[Bible] Failed to preload ${book} ${chapter}:`, error)
      }
    }
    
    console.log('[Bible] Popular chapters preloaded')
  }

  // Clear all cached Bible data
  async clearCache(): Promise<void> {
    await bibleCache.clear()
    console.log('[Bible] Cache cleared')
  }
}

export const bibleService = new BibleService()
