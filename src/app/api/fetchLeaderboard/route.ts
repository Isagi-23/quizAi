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
  return NextResponse.json({ data }, { status: 200 });
}
