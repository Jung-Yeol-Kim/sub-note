"use server";

import { db, examTopics } from "@/db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type TopicFilters = {
  examRound?: number;
  category?: string;
  difficulty?: number;
  year?: number;
  season?: string;
  search?: string;
};

// Get all exam topics with optional filters
export async function getExamTopics(filters?: TopicFilters) {
  try {
    let query = db
      .select()
      .from(examTopics)
      .orderBy(desc(examTopics.examRound), examTopics.questionNumber);

    // Apply filters
    const conditions = [];

    if (filters?.examRound) {
      conditions.push(eq(examTopics.examRound, filters.examRound));
    }

    if (filters?.category) {
      conditions.push(eq(examTopics.category, filters.category));
    }

    if (filters?.difficulty) {
      conditions.push(eq(examTopics.difficulty, filters.difficulty));
    }

    if (filters?.year) {
      conditions.push(eq(examTopics.year, filters.year));
    }

    if (filters?.season) {
      conditions.push(eq(examTopics.season, filters.season));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const results = await query;

    // Client-side search will be applied in the component
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching exam topics:", error);
    return { success: false, error: "Failed to fetch exam topics" };
  }
}

// Get a single exam topic by ID
export async function getExamTopic(id: string) {
  try {
    const result = await db
      .select()
      .from(examTopics)
      .where(eq(examTopics.id, id))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Topic not found" };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error fetching exam topic:", error);
    return { success: false, error: "Failed to fetch exam topic" };
  }
}

// Get topics by exam round
export async function getTopicsByExamRound(examRound: number) {
  try {
    const results = await db
      .select()
      .from(examTopics)
      .where(eq(examTopics.examRound, examRound))
      .orderBy(examTopics.questionNumber);

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching topics by exam round:", error);
    return { success: false, error: "Failed to fetch topics" };
  }
}

// Get topic statistics
export async function getTopicStatistics() {
  try {
    // Get total topics count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(examTopics);

    // Get unique exam rounds
    const roundsResult = await db
      .selectDistinct({ examRound: examTopics.examRound })
      .from(examTopics)
      .where(sql`${examTopics.examRound} IS NOT NULL`)
      .orderBy(desc(examTopics.examRound));

    // Get category distribution
    const categoriesResult = await db
      .select({
        category: examTopics.category,
        count: sql<number>`count(*)`,
      })
      .from(examTopics)
      .where(sql`${examTopics.category} IS NOT NULL`)
      .groupBy(examTopics.category);

    return {
      success: true,
      data: {
        total: totalResult[0]?.count || 0,
        examRounds: roundsResult.map(r => r.examRound).filter(Boolean),
        categories: categoriesResult,
      },
    };
  } catch (error) {
    console.error("Error fetching topic statistics:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}

// Increment topic frequency (when a topic is studied)
export async function incrementTopicFrequency(id: string) {
  try {
    const result = await db
      .update(examTopics)
      .set({
        frequency: sql`${examTopics.frequency} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(examTopics.id, id))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Topic not found" };
    }

    revalidatePath(`/topics/${id}`);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error incrementing topic frequency:", error);
    return { success: false, error: "Failed to update topic" };
  }
}

// Get related topics
export async function getRelatedTopics(topicId: string) {
  try {
    const topic = await db
      .select()
      .from(examTopics)
      .where(eq(examTopics.id, topicId))
      .limit(1);

    if (topic.length === 0 || !topic[0].relatedTopics) {
      return { success: true, data: [] };
    }

    // Get related topics by IDs
    const relatedIds = topic[0].relatedTopics;
    const results = await db
      .select()
      .from(examTopics)
      .where(sql`${examTopics.id} = ANY(${relatedIds})`);

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching related topics:", error);
    return { success: false, error: "Failed to fetch related topics" };
  }
}
