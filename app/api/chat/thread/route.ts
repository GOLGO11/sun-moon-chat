import { NextResponse } from "next/server";
import { getThread } from "@/src/lib/chat-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const viewerId = searchParams.get("viewerId");
  const matchId = searchParams.get("matchId");

  if (!viewerId || !matchId) {
    return NextResponse.json({ errorCode: "THREAD_INPUT_REQUIRED" }, { status: 400 });
  }

  return NextResponse.json(getThread(viewerId, matchId));
}
