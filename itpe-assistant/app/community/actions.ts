"use server";

import { db } from "@/db";
import {
  sharedSubNotes,
  comments,
  sharedSubNoteLikes,
  bookmarks,
  commentLikes,
  subNotes,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, sql, and, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get all shared sub-notes with filters
export async function getSharedSubNotes(options?: {
  category?: string;
  search?: string;
  sortBy?: "latest" | "popular" | "views";
  limit?: number;
  offset?: number;
}) {
  const {
    category,
    search,
    sortBy = "latest",
    limit = 20,
    offset = 0,
  } = options || {};

  let query = db
    .select({
      id: sharedSubNotes.id,
      title: sharedSubNotes.title,
      content: sharedSubNotes.content,
      category: sharedSubNotes.category,
      tags: sharedSubNotes.tags,
      difficulty: sharedSubNotes.difficulty,
      userId: sharedSubNotes.userId,
      userName: sharedSubNotes.userName,
      likes: sharedSubNotes.likes,
      views: sharedSubNotes.views,
      downloads: sharedSubNotes.downloads,
      createdAt: sharedSubNotes.createdAt,
      updatedAt: sharedSubNotes.updatedAt,
    })
    .from(sharedSubNotes)
    .where(eq(sharedSubNotes.isPublic, true));

  // Apply filters
  const conditions = [eq(sharedSubNotes.isPublic, true)];

  if (category) {
    conditions.push(eq(sharedSubNotes.category, category));
  }

  if (search) {
    conditions.push(
      or(
        ilike(sharedSubNotes.title, `%${search}%`),
        ilike(sharedSubNotes.content, `%${search}%`)
      )!
    );
  }

  query = query.where(and(...conditions));

  // Apply sorting
  switch (sortBy) {
    case "popular":
      query = query.orderBy(desc(sharedSubNotes.likes));
      break;
    case "views":
      query = query.orderBy(desc(sharedSubNotes.views));
      break;
    case "latest":
    default:
      query = query.orderBy(desc(sharedSubNotes.createdAt));
      break;
  }

  const results = await query.limit(limit).offset(offset);

  return results;
}

// Get a single shared sub-note with details
export async function getSharedSubNote(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [sharedSubNote] = await db
    .select()
    .from(sharedSubNotes)
    .where(eq(sharedSubNotes.id, id))
    .limit(1);

  if (!sharedSubNote) {
    return null;
  }

  // Increment views
  await db
    .update(sharedSubNotes)
    .set({ views: sql`${sharedSubNotes.views} + 1` })
    .where(eq(sharedSubNotes.id, id));

  // Get user's interaction status if logged in
  let userLiked = false;
  let userBookmarked = false;

  if (session?.user) {
    const [like] = await db
      .select()
      .from(sharedSubNoteLikes)
      .where(
        and(
          eq(sharedSubNoteLikes.sharedSubNoteId, id),
          eq(sharedSubNoteLikes.userId, session.user.id)
        )
      )
      .limit(1);

    const [bookmark] = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.sharedSubNoteId, id),
          eq(bookmarks.userId, session.user.id)
        )
      )
      .limit(1);

    userLiked = !!like;
    userBookmarked = !!bookmark;
  }

  return {
    ...sharedSubNote,
    views: sharedSubNote.views + 1,
    userLiked,
    userBookmarked,
  };
}

// Share a sub-note to community
export async function shareSubNote(subNoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Get the original sub-note
  const [subNote] = await db
    .select()
    .from(subNotes)
    .where(
      and(eq(subNotes.id, subNoteId), eq(subNotes.userId, session.user.id))
    )
    .limit(1);

  if (!subNote) {
    throw new Error("Sub-note not found");
  }

  // Check if already shared
  const existing = await db
    .select()
    .from(sharedSubNotes)
    .where(eq(sharedSubNotes.originalSubNoteId, subNoteId))
    .limit(1);

  if (existing.length > 0) {
    // Update existing shared sub-note
    const [updated] = await db
      .update(sharedSubNotes)
      .set({
        title: subNote.title,
        content: subNote.content,
        category: subNote.category,
        tags: subNote.tags,
        difficulty: subNote.difficulty,
        updatedAt: new Date(),
      })
      .where(eq(sharedSubNotes.id, existing[0].id))
      .returning();

    revalidatePath("/community");
    return updated;
  }

  // Create new shared sub-note
  const [shared] = await db
    .insert(sharedSubNotes)
    .values({
      originalSubNoteId: subNoteId,
      userId: session.user.id,
      userName: session.user.name,
      title: subNote.title,
      content: subNote.content,
      category: subNote.category,
      tags: subNote.tags,
      difficulty: subNote.difficulty,
      isPublic: true,
    })
    .returning();

  revalidatePath("/community");
  return shared;
}

// Toggle like on shared sub-note
export async function toggleLike(sharedSubNoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check if already liked
  const [existing] = await db
    .select()
    .from(sharedSubNoteLikes)
    .where(
      and(
        eq(sharedSubNoteLikes.sharedSubNoteId, sharedSubNoteId),
        eq(sharedSubNoteLikes.userId, session.user.id)
      )
    )
    .limit(1);

  if (existing) {
    // Unlike
    await db
      .delete(sharedSubNoteLikes)
      .where(eq(sharedSubNoteLikes.id, existing.id));

    await db
      .update(sharedSubNotes)
      .set({ likes: sql`${sharedSubNotes.likes} - 1` })
      .where(eq(sharedSubNotes.id, sharedSubNoteId));

    revalidatePath(`/community/${sharedSubNoteId}`);
    return { liked: false };
  }

  // Like
  await db.insert(sharedSubNoteLikes).values({
    sharedSubNoteId,
    userId: session.user.id,
  });

  await db
    .update(sharedSubNotes)
    .set({ likes: sql`${sharedSubNotes.likes} + 1` })
    .where(eq(sharedSubNotes.id, sharedSubNoteId));

  revalidatePath(`/community/${sharedSubNoteId}`);
  return { liked: true };
}

// Toggle bookmark
export async function toggleBookmark(sharedSubNoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [existing] = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.sharedSubNoteId, sharedSubNoteId),
        eq(bookmarks.userId, session.user.id)
      )
    )
    .limit(1);

  if (existing) {
    await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
    revalidatePath(`/community/${sharedSubNoteId}`);
    return { bookmarked: false };
  }

  await db.insert(bookmarks).values({
    sharedSubNoteId,
    userId: session.user.id,
  });

  revalidatePath(`/community/${sharedSubNoteId}`);
  return { bookmarked: true };
}

// Get comments for a shared sub-note
export async function getComments(sharedSubNoteId: string) {
  const allComments = await db
    .select()
    .from(comments)
    .where(eq(comments.sharedSubNoteId, sharedSubNoteId))
    .orderBy(desc(comments.createdAt));

  return allComments;
}

// Add a comment
export async function addComment(sharedSubNoteId: string, content: string, parentCommentId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [comment] = await db
    .insert(comments)
    .values({
      sharedSubNoteId,
      userId: session.user.id,
      userName: session.user.name,
      userImage: session.user.image || undefined,
      content,
      parentCommentId: parentCommentId || null,
    })
    .returning();

  revalidatePath(`/community/${sharedSubNoteId}`);
  return comment;
}

// Delete a comment
export async function deleteComment(commentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1);

  if (!comment || comment.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await db.delete(comments).where(eq(comments.id, commentId));

  revalidatePath(`/community/${comment.sharedSubNoteId}`);
  return { success: true };
}

// Toggle comment like
export async function toggleCommentLike(commentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [existing] = await db
    .select()
    .from(commentLikes)
    .where(
      and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, session.user.id)
      )
    )
    .limit(1);

  if (existing) {
    await db.delete(commentLikes).where(eq(commentLikes.id, existing.id));

    await db
      .update(comments)
      .set({ likes: sql`${comments.likes} - 1` })
      .where(eq(comments.id, commentId));

    return { liked: false };
  }

  await db.insert(commentLikes).values({
    commentId,
    userId: session.user.id,
  });

  await db
    .update(comments)
    .set({ likes: sql`${comments.likes} + 1` })
    .where(eq(comments.id, commentId));

  return { liked: true };
}

// Download/copy sub-note to user's collection
export async function downloadSubNote(sharedSubNoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Get the shared sub-note
  const [sharedSubNote] = await db
    .select()
    .from(sharedSubNotes)
    .where(eq(sharedSubNotes.id, sharedSubNoteId))
    .limit(1);

  if (!sharedSubNote) {
    throw new Error("Shared sub-note not found");
  }

  // Copy to user's sub-notes
  const [newSubNote] = await db
    .insert(subNotes)
    .values({
      userId: session.user.id,
      title: `${sharedSubNote.title} (복사본)`,
      content: sharedSubNote.content,
      category: sharedSubNote.category,
      tags: sharedSubNote.tags,
      difficulty: sharedSubNote.difficulty,
      status: "draft",
    })
    .returning();

  // Increment downloads counter
  await db
    .update(sharedSubNotes)
    .set({ downloads: sql`${sharedSubNotes.downloads} + 1` })
    .where(eq(sharedSubNotes.id, sharedSubNoteId));

  revalidatePath("/sub-notes");
  revalidatePath(`/community/${sharedSubNoteId}`);
  return newSubNote;
}
