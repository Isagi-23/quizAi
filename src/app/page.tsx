"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import dailoqa from "@/public/images/Dailoqa_01.jpg";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";
import featuresBg from "@/public/images/futuristic-woman-in-space-fashion-outfit-picjumbo-com.jpg";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen  dark:bg-gradient-to-blue from-gray-700 ">
      {/* Header */}
      

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Generate Engaging Quizzes with AI
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create custom quizzes in seconds using our advanced AI technology.
          Perfect for educators, trainers, and content creators.
        </p>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            router.push("/generate-quiz");
          }}
        >
          Get Started 
        </Button>
      </section>

      {/* Features Section */}
      <section id="features" className="relative  py-20">
  <div className="absolute inset-0 -z-10">
    <Image
      src={featuresBg}
      alt="Features background"
      layout="fill"
      objectFit="cover"
      objectPosition="center"
      priority
    />
    <div className="absolute inset-0 bg-gray-800 bg-opacity-70"></div> Optional overlay
  </div>
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold mb-12 text-center text-white">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        "AI-Powered Generation",
        "Customizable Templates",
        "Instant Results",
      ].map((feature, index) => (
        <Card key={index} className="bg-gray-700 border-gray-600">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-white">{feature}</h3>
            <p className="text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              do eiusmod tempor incididunt ut labore et dolore magna
              aliqua.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Our Users Say
          </h2>
          <blockquote className="text-center max-w-2xl mx-auto">
            <p className="text-xl italic mb-4">
              "QuizAI has revolutionized how I create assessments for my
              students. It's fast, accurate, and incredibly easy to use!"
            </p>
            <footer className="text-gray-400">
              - Sarah Johnson, High School Teacher
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">QuizAI</span>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="mt-4 text-center text-gray-400">
            © {new Date().getFullYear()} Dailoqa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
