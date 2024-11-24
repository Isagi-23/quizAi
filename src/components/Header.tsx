"use client";
import React from "react";
import dailoqa from "@/public/images/Dailoqa_01.jpg";

const Header = () => {
  return (
    <header className="sm:px-10 container mx-auto px-4 py-6 flex justify-between items-center">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <div className="w-28 scale-[4] bg-gray-700  flex items-center justify-center ">
          {/* Placeholder for logo */}
          <img src={dailoqa.src} alt="Logo" className="w-full bg-cover" />
          {/* <span className="text-xl font-bold">Q</span> */}
        </div>
        <span className=" relative text-4xl text-center left-[15%] font-bold z-10">
          QuizAI
        </span>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>{/* <ModeToggle/> */}</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
