import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "ok" }, { status: 200 });
}

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { topic, questionCount } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a quiz generator. Create a multiple-choice quiz on the topic "${topic}" with ${questionCount} questions. Each question should have one correct answer and three plausible incorrect answers. Format the response as a JSON array of objects, where each object represents a question and has the following structure: { "question": "...", "choices": ["A. ...", "B. ...", "C. ...", "D. ..."], "correctAnswer": "A" }`,
        },
      ],
    });

    const quizData = JSON.parse(
      completion.choices[0]?.message?.content || "[]"
    );
    console.log("Quiz Data:", quizData);

    if (!Array.isArray(quizData) || quizData.length === 0) {
      throw new Error("Quiz data is empty or malformed");
    }

    // const updatedQuiz = await prisma.quiz.create({
    //   data: {
    //     topic,
    //     numberOfQuestions: Number(questionCount),
    //     sharedUrl: `${(Math.random() * 123123).toString(36).slice(2)}`, // Temporary placeholder
    //   },
    // });

    const createdQuiz = await prisma.quiz.create({
      data: {
        topic,
        numberOfQuestions: Number(questionCount),
        sharedUrl: `${(Math.random() * 123213).toString(36).slice(2)}`, // Temporary placeholder
        questions: {
          create: quizData.map((question: any) => {
            const correctAnswerIndex =
              question.correctAnswer.charCodeAt(0) - 65; // A = 0, B = 1, etc.
            const answers = question.choices.map(
              (choice: string, index: number) => ({
                text: choice,
                isCorrect: index === correctAnswerIndex,
              })
            );

            return {
              text: question.question,
              answers: {
                create: answers,
              },
              // correctAnswerId: answers[correctAnswerIndex]?.id, // Will be set post creation
            };
          }),
        },
      },
    });

    // Update sharedUrl for the created quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id: createdQuiz.id },
      data: {
        sharedUrl: `http://localhost:3000/quiz/${createdQuiz.id}`,
      },
    });

    console.log("Created Quiz with Updated URL:", updatedQuiz);

    return NextResponse.json({ id: updatedQuiz.id }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { message: "Error generating quiz", error: error.message },
      { status: 500 }
    );
  }
}
