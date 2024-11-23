import prisma from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Quiz ID is required" },
      { status: 400 } 
    );
  }

  try {
    const questions = await prisma.question.findMany({
      where: {
        quizId: id,
      },
      select: {
          text: true,
          answers: true,
      }
    });

    // If no questions are found, return a 404 response
    if (questions.length === 0) {
      return NextResponse.json(
        { message: "No questions found for this quiz" },
        { status: 404 }
      );
    }

    // Return the questions
    return NextResponse.json(questions, { status: 200 });
  } catch (error:any) {
    console.error("Error fetching questions:", error);

    // Handle server errors
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 } // Internal Server Error
    );
  }
}