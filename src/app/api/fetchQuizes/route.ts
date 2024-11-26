import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: NextRequest) {
  console.log("server quiz fetched")
  const data = await prisma.quiz.findMany({ orderBy: { createdAt: "desc" } });

  const response = NextResponse.json({ data }, { status: 200 });

  // Set the Cache-Control header
  response.headers.set(
    "Cache-Control",
    "no-cache, no-store, max-age=0, must-revalidate"
  );

  return response;
}