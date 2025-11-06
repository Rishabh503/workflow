"use client";

import { AnimatedList } from "@/components/ui/animated-list";
import { Meteors } from "@/components/ui/meteors";
import { TextAnimate } from "@/components/ui/text-animate";
import { TypingAnimation } from "@/components/ui/typing-animation";
import React, { useEffect, useRef, useState } from "react";
import { features } from "../../../../public/data/features";

const NewHome = () => {
  const leftFeatures = features.slice(0, features.length / 2);
  const rightFeatures = features.slice(features.length / 2);

  const sectionRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartAnimation(true);
        }
      },
      { threshold: 0.7 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-screen">

      
      <Meteors
        number={200}
        className="text-blue-300 fixed inset-0 pointer-events-none z-[1]"
      />

      {/* ✅ PAGE CONTENT ABOVE METEORS */}
      <div className="relative px-10  z-[5]">

        {/* HERO */}
        <div className="relative flex h-[500px] max-w-8xl mx-auto items-center justify-center rounded-lg">
          <div className="flex items-center justify-center flex-col p-12">
            <span className="pointer-events-none bg-gradient-to-b from-blue-800 to-gray-300/90 bg-clip-text text-center text-9xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-red-900 dark:to-black">
              <TypingAnimation>Workflow Tracker</TypingAnimation>
            </span>

            <p className="px-32 py-2 mx-auto text-[16px]">
              <TextAnimate delay={2} animation="blurIn" as="h1">
                Empower your academic journey with AI-powered workflow tracking
                tailored for students. Track your daily work, set goals, and
                stay ahead.
              </TextAnimate>
            </p>
          </div>
        </div>

        {/* SECOND SECTION */}
        <div
          ref={sectionRef}
          className="relative flex h-auto max-w-8xl mx-auto my-10 py-10 justify-between items-center"
        >
          {/* Left column */}
          <div className="flex flex-col w-1/3 items-center">
            {startAnimation && (
              <AnimatedList>
                {leftFeatures.map((f, i) => (
                  <div key={i} className="bg-[#1e293b] p-6 rounded-xl mb-4">
                    <div className="mb-4">{f.icon}</div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{f.desc}</p>
                  </div>
                ))}
              </AnimatedList>
            )}
          </div>

          {/* Middle text */}
          <div className="w-1/3 text-center">
            <p className="text-3xl font-bold mb-2">
              Ready To Transform Your Study Habits?
            </p>
            <p className="text-gray-300">
              Join thousands of students achieving their goals.
            </p>
          </div>

          {/* Right column */}
          <div className="flex flex-col w-1/3 items-center">
            {startAnimation && (
              <AnimatedList>
                {rightFeatures.map((f, i) => (
                  <div key={i} className="bg-[#1e293b] p-6 rounded-xl mb-4">
                    <div className="mb-4">{f.icon}</div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{f.desc}</p>
                  </div>
                ))}
              </AnimatedList>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHome;
