import { NextResponse } from "next/server";
import { generateChart } from "@/src/lib/astrology";
import type { BirthInput } from "@/src/types/demo";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<BirthInput>;

  try {
    const chart = generateChart({
      birthDate: body.birthDate ?? "",
      birthTime: body.birthTime ?? "",
      city: body.city ?? "",
    });

    return NextResponse.json(chart);
  } catch (error) {
    const message = error instanceof Error ? error.message : "CHART_FAILED";

    return NextResponse.json(
      { errorCode: message },
      {
        status: message === "CITY_UNSUPPORTED" || message === "BIRTH_TIME_REQUIRED" ? 400 : 422,
      },
    );
  }
}
