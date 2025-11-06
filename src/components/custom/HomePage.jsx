import Image from "next/image";
import hero from "../../../public/hero2.png";
import { features } from "../../../public/data/features";
import { Button } from "../ui/button";
import Graph from "./Graph";
import { AuroraText } from "../ui/aurora-text";
import { TypingAnimation } from "../ui/typing-animation";

export default function HomePage() {
  return (
    <div className="bg-[#0f172a] text-white">
      {/* HERO */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* text */}
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
             WorkFlow
              <AuroraText> <TypingAnimation> Tracker</TypingAnimation>   </AuroraText>
            </h1>

            <p className="text-gray-300 text-lg max-w-md">
              Empower your academic journey with AI-powered workflow tracking
              tailored for students. Track your daily work, set goals, and stay
              ahead.
            </p>

            <ul className="space-y-1 flex justify-between gap-2  text-xl font-semibold">
            <li> <TypingAnimation showCursor={false}>
              Track Your Daily Work
              </TypingAnimation>  </li>
             <li> <TypingAnimation  showCursor={false}> Set Goals</TypingAnimation></li>
           <li> <TypingAnimation showCursor={false}>
              Be Ahead with AI
              </TypingAnimation>  </li>
            </ul>
          </div>

          {/* image */}
          <div className="flex justify-center">
            <Image src={hero} alt="hero" className="w-full max-w-lg h-auto" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-gray-300 mb-10 max-w-xl">
            StudyFlow offers a comprehensive suite of tools designed to enhance
            your study habits and academic performance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-[#1e293b] p-6 rounded-xl">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <p className="text-3xl font-bold mb-2">
          Ready To Transform Your Study Habits?
        </p>
        <p className="text-gray-300">
          Join thousands of students achieving their goals.
        </p>
      </section>

      {/* GRAPH SECTION */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <Graph />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-bold">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Step 1: Add Subjects",
                desc: "Start by listing all your subjects to personalize your dashboard.",
              },
              {
                title: "Step 2: Log Sessions",
                desc: "Track your daily progress with smart session logs and AI tips.",
              },
              {
                title: "Step 3: Set & Smash Goals",
                desc: "Set goals with AI help and monitor completion over time.",
              },
            ].map((s, i) => (
              <div key={i} className="bg-[#1e293b] p-6 rounded-xl text-left">
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>

          <Button className="bg-blue-600 px-6 py-3">Get Started</Button>
        </div>
      </section>
    </div>
  );
}
