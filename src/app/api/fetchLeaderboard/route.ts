import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const quizId = req.nextUrl.searchParams.get("id") as string;
  console.log(quizId);
  const data = await prisma.leaderboard.findMany({
    where: { quizId },
    orderBy: { score: "desc" },
  });
  console.log(data);
  const response = NextResponse.json({ data }, { status: 200 });
  response.headers.set(
    "Cache-Control",
    "no-cache, no-store, max-age=0, must-revalidate"
  );
  return response;
}
