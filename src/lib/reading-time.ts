/**
 * Reading time calculation utility
 * Based on average reading speeds of 200-250 words per minute
 */

// Average reading speed: 200 words per minute (conservative estimate)
const WORDS_PER_MINUTE = 200;

/**
 * Strips HTML tags and calculates word count from content
 */
function getWordCount(content: string): number {
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');

  // Remove extra whitespace and split into words
  const words = textContent
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(word => word.length > 0);

  return words.length;
}

/**
 * Calculate estimated reading time for content
 * @param content - The content to analyze (supports HTML/markdown)
 * @returns Reading time string in format "X min read"
 */
export function calculateReadingTime(content: string): string {
  const wordCount = getWordCount(content);
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  // Minimum 1 minute read time for very short content
  const readingTime = Math.max(1, minutes);

  return `${readingTime} min read`;
}

/**
 * Calculate reading time and return both the formatted string and raw minutes
 */
export function calculateReadingTimeDetailed(content: string) {
  const wordCount = getWordCount(content);
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  const readingTime = Math.max(1, minutes);

  return {
    minutes: readingTime,
    text: `${readingTime} min read`,
    wordCount
  };
}