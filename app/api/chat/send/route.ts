import { NextResponse } from "next/server";
import { sendThreadMessage } from "@/src/lib/chat-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    from?: string;
    text?: string;
    to?: string;
  };

  if (!body.from || !body.to) {
    return NextResponse.json({ errorCode: "CHAT_PARTICIPANTS_REQUIRED" }, { status: 400 });
  }

  try {
    return NextResponse.json({
      ok: true,
      message: sendThreadMessage(body.from, body.to, body.text ?? ""),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CHAT_SEND_FAILED";

    return NextResponse.json(
      { errorCode: message },
      {
        status: message === "MESSAGE_EMPTY" ? 400 : 422,
      },
    );
  }
}
