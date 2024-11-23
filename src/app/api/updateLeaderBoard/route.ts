import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { name, score, time, quizId } = await req.json();
  const data = await prisma.leaderboard.create({
    data: {
      participantName: name,
      score,
      completionTime: time,
      quizId,
    },
  });
  return NextResponse.json(data);
}
