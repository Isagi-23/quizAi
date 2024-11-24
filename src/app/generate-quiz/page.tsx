"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Brain, Loader2, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from "@/components/ui/use-toast"
import dailoqa from "@/public/images/Dailoqa_01.jpg";
import bg from "@/public/images/WhatsApp Image 2024-11-21 at 19.06.37.jpeg";

const suggestedTopics = [
  "History",
  "Science",
  "Pop Culture",
  "Geography",
  "Literature",
  "Sports",
];

// const recentQuizzes = [
//   { id: "1", title: "World History Quiz", url: "/quiz/1" },
//   { id: "2", title: "Science Fundamentals", url: "/quiz/2" },
//   { id: "3", title: "Pop Culture Trivia", url: "/quiz/3" },
// ];

export default function Home() {
  const router = useRouter();
  // const { toast } = useToast()
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<any>([]);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/generate-quiz", {
        topic,
        questionCount,
      });

      const quizData = response.data;
      router.push(`/quiz/${quizData.id}`);
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/quiz/${id}`
      );
      console.log("Copied:", `${window.location.origin}/quiz/${id}`, id);
      setCopiedId(id);
      // toast({
      //   title: "Link copied!",
      //   description: "Quiz link has been copied to clipboard",
      // })
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const fetchQuizes = async () => {
    try {
      const response = await axios.get("/api/fetchQuizes");
      console.log(response.data);
      setRecentQuizzes(response.data.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching quizes:", error);
    }
  };

  useEffect(() => {
    fetchQuizes();
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {/* Use the img tag for the background */}
      <img
        src={bg.src}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />

      {/* Content goes here */}
      <div className="relative z-10 ">
        <div className="  relative z-10 md:grid md:grid-flow-row md:grid-cols-12 gap-10 mt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-row col-span-6 md:mt-10 mt-4"
          >
            <Card className="w-full max-w-md mx-auto backdrop-blur-md  ">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/Dailoqa_01.jpg" alt="Dailoqa Logo" />
                    <AvatarFallback>
                      <Brain className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold text-center">
                  AI-Powered Quiz Generator
                </CardTitle>
                <CardDescription className="text-center">
                  Enter a topic to generate a timed multiple-choice quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Quiz Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Enter quiz topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="questionCount">Number of Questions</Label>
                    <Select
                      value={questionCount}
                      onValueChange={setQuestionCount}
                    >
                      <SelectTrigger
                        id="questionCount"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                      >
                        <SelectValue placeholder="Select question count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full text-lg font-semibold transition-all duration-200 hover:shadow-lg"
                  onClick={handleStartQuiz}
                  disabled={isLoading || !topic}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    "Start Quiz"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          <div className="col-span-2"></div>
          <div className="flex flex-col col-span-4 justify-end md:mr-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 md:mt-10 w-full max-w-md mx-auto col-span-3"
            >
              <Card className="backdrop-blur-md bg-background/90">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    Suggested Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedTopics.map((suggestedTopic) => (
                      <motion.div
                        key={suggestedTopic}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => setTopic(suggestedTopic)}
                          className="transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                        >
                          {suggestedTopic}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 md:mt-10 w-full max-w-md mx-auto col-span-3"
            >
              <Card className="backdrop-blur-md bg-background/90 ">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Recent Quizzes
                  </CardTitle>
                  <CardDescription>
                    Your recently created quizzes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQuizzes.map((quiz: any) => (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <Button
                          variant="ghost"
                          onClick={() => router.push(`/quiz/${quiz.id}`)}
                        >
                          <span className="font-medium">{quiz.topic}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(quiz.url, quiz.id)}
                        >
                          {copiedId === quiz.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="sr-only">Copy link</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
