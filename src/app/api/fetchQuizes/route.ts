import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
export async function GET(req: NextRequest) {
  const data = await prisma.quiz.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data }, { status: 200 });
}
