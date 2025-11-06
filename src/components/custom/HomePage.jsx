import Image from "next/image";
import hero from "../../../public/hero2.png";
import { features } from "../../../public/data/features";
import { Button } from "../ui/button";
import Graph from "./Graph";
import { AuroraText } from "../ui/aurora-text";
import { TypingAnimation } from "../ui/typing-animation";
import NewHome from "@/app/(pages)/test/page";

export default function HomePage() {
  return (
    <div className="bg-[#0f172a] text-white">
      <NewHome/>
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
