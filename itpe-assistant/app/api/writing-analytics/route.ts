import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateWritingAnalytics } from "@/components/actions/writing-practice-actions";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analytics = await generateWritingAnalytics(session.user.id);

    if (!analytics) {
      return NextResponse.json(
        { error: "Not enough data for analysis. Complete at least 5 challenges." },
        { status: 400 }
      );
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error generating analytics:", error);
    return NextResponse.json(
      { error: "Failed to generate analytics" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This would fetch the latest analytics from the database
    // For now, just return success
    return NextResponse.json({ message: "Analytics endpoint ready" });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
