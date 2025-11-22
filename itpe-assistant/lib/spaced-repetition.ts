/**
 * Spaced Repetition Algorithm (SM-2)
 * Based on SuperMemo 2 algorithm
 *
 * Quality ratings:
 * 5 - perfect response
 * 4 - correct response after a hesitation
 * 3 - correct response recalled with serious difficulty
 * 2 - incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout
 */

export interface ReviewData {
  easeFactor: number; // Ease factor (default: 2.5, stored as 250)
  interval: number; // Days until next review
  repetitions: number; // Number of consecutive correct reviews
}

export interface ReviewResult extends ReviewData {
  nextReviewDate: Date;
}

/**
 * Calculate next review schedule based on quality rating
 * @param quality - Quality rating (0-5)
 * @param currentData - Current review data
 * @returns Updated review data with next review date
 */
export function calculateNextReview(
  quality: number,
  currentData?: Partial<ReviewData>
): ReviewResult {
  // Default values
  let easeFactor = currentData?.easeFactor ?? 250; // 2.5 * 100
  let interval = currentData?.interval ?? 0;
  let repetitions = currentData?.repetitions ?? 0;

  // Convert easeFactor from stored integer (250 = 2.5)
  let ef = easeFactor / 100;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    repetitions += 1;
  } else {
    // Incorrect response - reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ease factor should not be less than 1.3
  if (ef < 1.3) {
    ef = 1.3;
  }

  // Convert back to integer for storage
  easeFactor = Math.round(ef * 100);

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Get topics due for review
 * @param topics - All topics with review schedule
 * @returns Topics that are due for review
 */
export function getDueTopics<T extends { nextReviewDate: Date | null }>(
  topics: T[]
): T[] {
  const now = new Date();
  return topics.filter((topic) => {
    if (!topic.nextReviewDate) return true; // Never reviewed
    return topic.nextReviewDate <= now;
  });
}

/**
 * Sort topics by priority (urgent reviews first)
 * @param topics - Topics to sort
 * @returns Sorted topics
 */
export function sortByReviewPriority<
  T extends { nextReviewDate: Date | null; easeFactor: number }
>(topics: T[]): T[] {
  return topics.sort((a, b) => {
    // Never reviewed topics first
    if (!a.nextReviewDate && !b.nextReviewDate) return 0;
    if (!a.nextReviewDate) return -1;
    if (!b.nextReviewDate) return 1;

    // Then by overdue amount (most overdue first)
    const aDaysOverdue =
      (new Date().getTime() - a.nextReviewDate.getTime()) / (1000 * 60 * 60 * 24);
    const bDaysOverdue =
      (new Date().getTime() - b.nextReviewDate.getTime()) / (1000 * 60 * 60 * 24);

    if (aDaysOverdue !== bDaysOverdue) {
      return bDaysOverdue - aDaysOverdue;
    }

    // Then by difficulty (lower ease factor = more difficult = higher priority)
    return a.easeFactor - b.easeFactor;
  });
}

/**
 * Get recommended daily review count
 * @param totalTopics - Total number of topics
 * @param targetDays - Days until exam
 * @returns Recommended number of topics to review per day
 */
export function getRecommendedDailyReviews(
  totalTopics: number,
  targetDays: number
): number {
  if (targetDays <= 0) return totalTopics;

  // Aim to review each topic at least 3 times before exam
  const targetReviews = totalTopics * 3;
  const dailyReviews = Math.ceil(targetReviews / targetDays);

  // Cap at reasonable number (max 20 per day)
  return Math.min(dailyReviews, 20);
}
