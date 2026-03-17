import { NextResponse } from "next/server";
import { getMatchesForBirthInput, getMatchesForUser } from "@/src/lib/matching";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const birthDate = searchParams.get("birthDate");
  const birthTime = searchParams.get("birthTime");
  const city = searchParams.get("city");

  if (userId) {
    const matches = getMatchesForUser(userId);

    if (!matches) {
      return NextResponse.json({ errorCode: "USER_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(matches);
  }

  if (birthDate && birthTime && city) {
    return NextResponse.json(
      getMatchesForBirthInput({
        birthDate,
        birthTime,
        city,
      }),
    );
  }

  return NextResponse.json({ errorCode: "MATCH_INPUT_REQUIRED" }, { status: 400 });
}
