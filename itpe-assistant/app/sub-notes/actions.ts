"use server";

import { db, subNotes } from "@/db";
import { eq, desc, and, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type SubNoteInput = {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  status?: "draft" | "in_review" | "completed";
  difficulty?: number;
};

// Get all sub-notes for a user
export async function getSubNotes(userId: string, filters?: {
  category?: string;
  status?: string;
  search?: string;
}) {
  try {
    let query = db
      .select()
      .from(subNotes)
      .where(eq(subNotes.userId, userId))
      .orderBy(desc(subNotes.updatedAt));

    // TODO: Add filters when conditions are implemented
    // For now, return all sub-notes
    const results = await query;
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching sub-notes:", error);
    return { success: false, error: "Failed to fetch sub-notes" };
  }
}

// Get a single sub-note by ID
export async function getSubNote(id: string, userId: string) {
  try {
    const result = await db
      .select()
      .from(subNotes)
      .where(and(eq(subNotes.id, id), eq(subNotes.userId, userId)))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Sub-note not found" };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error fetching sub-note:", error);
    return { success: false, error: "Failed to fetch sub-note" };
  }
}

// Create a new sub-note
export async function createSubNote(userId: string, data: SubNoteInput) {
  try {
    const result = await db
      .insert(subNotes)
      .values({
        userId,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
        status: data.status || "draft",
        difficulty: data.difficulty,
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/sub-notes");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error creating sub-note:", error);
    return { success: false, error: "Failed to create sub-note" };
  }
}

// Create a new sub-note (auth-aware version)
export async function createSubNoteWithAuth(data: SubNoteInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  return createSubNote(session.user.id, data);
}

// Update an existing sub-note
export async function updateSubNote(
  id: string,
  userId: string,
  data: Partial<SubNoteInput>
) {
  try {
    const result = await db
      .update(subNotes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(subNotes.id, id), eq(subNotes.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Sub-note not found" };
    }

    revalidatePath("/sub-notes");
    revalidatePath(`/sub-notes/${id}`);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error updating sub-note:", error);
    return { success: false, error: "Failed to update sub-note" };
  }
}

// Delete a sub-note
export async function deleteSubNote(id: string, userId: string) {
  try {
    const result = await db
      .delete(subNotes)
      .where(and(eq(subNotes.id, id), eq(subNotes.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Sub-note not found" };
    }

    revalidatePath("/sub-notes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting sub-note:", error);
    return { success: false, error: "Failed to delete sub-note" };
  }
}

// Mark sub-note as reviewed
export async function markSubNoteAsReviewed(id: string, userId: string) {
  try {
    const result = await db
      .update(subNotes)
      .set({
        lastReviewedAt: new Date(),
      })
      .where(and(eq(subNotes.id, id), eq(subNotes.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Sub-note not found" };
    }

    revalidatePath(`/sub-notes/${id}`);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error marking sub-note as reviewed:", error);
    return { success: false, error: "Failed to mark sub-note as reviewed" };
  }
}
