import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTodayEncouragement } from "@/lib/encouragement";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const forceAI = searchParams.get("ai") === "true";

    const message = await getTodayEncouragement(session.user.id, forceAI);

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Encouragement error:", error);
    return NextResponse.json(
      { error: "Failed to get encouragement message" },
      { status: 500 }
    );
  }
}
