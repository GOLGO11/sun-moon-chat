import { NextResponse } from "next/server";
import { reportThread } from "@/src/lib/chat-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    matchId?: string;
    viewerId?: string;
  };

  if (!body.viewerId || !body.matchId) {
    return NextResponse.json({ errorCode: "REPORT_INPUT_REQUIRED" }, { status: 400 });
  }

  return NextResponse.json(reportThread(body.viewerId, body.matchId));
}
