"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Leaderboard } from "@/components/Leaderboard";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Confetti } from "@/components/Confetti";
import axios from "axios";
import Image from "next/image";
import quizBg from "@/public/images/illustrated-rendering-twin-avatar.jpg";
import quizBg1 from "@/public/images/close-up-character-composed-futuristic-scifi-luminous-particles.jpg";

interface Question {
  question: string;
  choices: any[];
  correctAnswer: string;
}

export default function QuizPage() {
  const router = useRouter();
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState<any>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startingQuiz, setStartingQuiz] = useState(false);

  const playerNames = [
    "NeuralNexus",
    "DataDrifter",
    "TechSavvy",
    "AIChallenger",
    "QuantumCoder",
    "CyberCircuit",
    "LogicLoom",
    "PixelPioneer",
    "CodeCrafter",
    "SynthStream",
  ];

  function getRandomPlayerName() {
    const randomIndex = Math.floor(Math.random() * playerNames.length);
    return playerNames[randomIndex];
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`/api/fetchLeaderboard?id=${id}`);
      console.log(response.data.data);
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleFinishQuiz = (finalScore: number) => {
    const totalTime = questions.length * 20 - timeLeft;

    const newLeaderboard = [
      {
        name: playerName || "Anonymous",
        score: finalScore,
        time: totalTime,
        rank: 1,
      },
      {
        name: "Player 2",
        score: finalScore - 1,
        time: totalTime + 10,
        rank: 2,
      },
      {
        name: "Player 3",
        score: finalScore - 2,
        time: totalTime + 20,
        rank: 3,
      },
      {
        name: "Player 4",
        score: finalScore - 3,
        time: totalTime + 30,
        rank: 4,
      },
      {
        name: "Player 5",
        score: finalScore - 4,
        time: totalTime + 40,
        rank: 5,
      },
    ];

    const updateLeaderBoard = async () => {
      try {
        const response = await axios.post("/api/updateLeaderBoard", {
          name: playerName || "Anonymous",
          score: finalScore,
          time: totalTime,
          quizId: id,
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error updating leaderboard:", error);
      }
    };
    updateLeaderBoard();
    setLeaderboard(newLeaderboard);
    setQuizFinished(true);
  };

  const fetchQuestionsAnswers = async (id: string) => {
    const response = await axios.get(`/api/fetchQuestions?id=${id}`);
    console.log(response.data);
    return response.data;
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetchQuestionsAnswers(id as string);
          const data = response.map((item: any) => ({
            question: item.text,
            choices: item.answers,
            correctAnswer: item.correctAnswer,
          }));
          setQuestions(data);
        } catch (error) {
          console.error("Error fetching quiz data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (currentQuestion > 0 && timeLeft > 0 && !quizFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuestion > 0) {
      handleNextQuestion();
    }
  }, [timeLeft, quizFinished, currentQuestion]);

  // const handleNextQuestion = () => {
  //   const updatedScore=
  //   console.log(
  //     questions[currentQuestion - 1]?.choices?.find(
  //       (choice: any) => choice.isCorrect
  //     )?.id,
  //     selectedAnswer
  //   );
  //   if (
  //     selectedAnswer ===
  //     questions[currentQuestion - 1]?.choices?.find(
  //       (choice: any) => choice.isCorrect
  //     )?.id
  //   ) {
  //     setScore(score + 1);
  //     setShowConfetti(true);
  //     setTimeout(() => setShowConfetti(false), 2000);
  //   }

  //   if (currentQuestion < questions.length ) {
  //     setCurrentQuestion(currentQuestion + 1);
  //     setSelectedAnswer("");
  //     setTimeLeft(20);
  //   } else {
  //     handleFinishQuiz();
  //   }
  // };

  const handleNextQuestion = () => {
    const isCorrect =
      selectedAnswer ===
      questions[currentQuestion - 1]?.choices?.find(
        (choice: any) => choice.isCorrect
      )?.id;

    const updatedScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(updatedScore);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setTimeLeft(20);
    } else {
      setScore(updatedScore); // Ensure the latest score is set before finishing
      handleFinishQuiz(updatedScore); // Pass the updated score explicitly
    }
  };

  const handleStartQuiz = async () => {
    setStartingQuiz(true);
    setPlayerName(playerName || getRandomPlayerName());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentQuestion(1); // Start the quiz
    setTimeLeft(20); // Reset the timer to 20 seconds
    setStartingQuiz(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            <div className="w-16 h-16 border-4 border-primary border-dashed rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold">Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="relative h-screen">
        <div className="absolute inset-0 -z-10">
          <Image
            src={quizBg}
            alt="Quiz background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>{" "}
          {/* Optional overlay */}
        </div>
        <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
          <Card className="w-full max-w-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-3xl text-center">
                Quiz Completed!
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${playerName}`}
                />
                <AvatarFallback>
                  {playerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-4xl font-bold mb-2">{playerName}</p>
              <p className="text-2xl">
                Your Score:{" "}
                <span className="font-bold text-primary">{score}</span> /{" "}
                {questions.length}
              </p>
              <Progress
                value={(score / questions.length) * 100}
                className="w-full mt-4"
              />
            </CardContent>
          </Card>
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Leaderboard id={id} />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/quiz")} size="lg">
                Back to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (currentQuestion === 0 && !quizFinished) {
    return (
      <div className="relative h-screen">
        <div className="absolute inset-0 -z-10">
          <Image
            src={quizBg}
            alt="Quiz background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>{" "}
          {/* Optional overlay */}
        </div>

        <div className="container mx-auto p-4 h-screen flex items-center justify-center -mt-10">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Welcome to the Quiz!
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${playerName}`}
                />
                <AvatarFallback>
                  {playerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Input
                placeholder="Your Name (optional)"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-center text-lg"
              />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleStartQuiz} size="lg">
                {startingQuiz ? "Starting ..." : "Start Quiz"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 -z-10">
        <Image
          src={quizBg1}
          alt="Quiz background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>{" "}
        {/* Optional overlay */}
      </div>
      <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
        {showConfetti && <Confetti />}
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                Question {currentQuestion} of {questions.length}
              </CardTitle>
              <Progress
                value={(currentQuestion / questions.length) * 100}
                className="w-64"
              />
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{playerName}</p>
              <p className="text-sm">Score: {score}</p>
              <p className="text-sm font-medium text-primary">
                Time Left: {timeLeft}s
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-6">
              {questions[currentQuestion - 1]?.question}
            </p>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              className="space-y-4"
            >
              {questions[currentQuestion - 1]?.choices.map(
                (choice: any, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 rounded-lg border transition-colors hover:bg-accent"
                  >
                    <RadioGroupItem value={choice.id} id={`choice-${index}`} />
                    <Label
                      htmlFor={`choice-${index}`}
                      className="flex-grow cursor-pointer"
                    >
                      {choice.text}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Select an answer and click Next
            </p>
            <Button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              size="lg"
            >
              {currentQuestion < questions.length
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
