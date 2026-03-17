import { NextResponse } from "next/server";
import { composeReading } from "@/src/lib/reading";
import type { ReadingRequest } from "@/src/types/demo";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ReadingRequest>;

  try {
    const result = composeReading({
      prompt: body.prompt ?? "",
      chart: {
        sun: body.chart?.sun ?? "",
        moon: body.chart?.moon ?? "",
        ascendant: body.chart?.ascendant ?? "",
      },
    } as ReadingRequest);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "READING_FAILED";

    return NextResponse.json(
      { errorCode: message },
      {
        status: message === "CHART_REQUIRED" ? 400 : 422,
      },
    );
  }
}
