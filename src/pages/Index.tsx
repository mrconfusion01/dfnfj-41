
import { useState } from "react";
import Navbar from "@/components/Navbar";

const features = [
  {
    title: "Mindful Moments",
    description: "Take a breather with short, guided mindfulness exercises to calm your mind and body in just a few minutes.",
    icon: "🧘‍♀️",
  },
  {
    title: "Emotional First Aid Kit",
    description: "Quick-access tools for moments of crisis, including grounding exercises, breathing techniques, and crisis hotline connections.",
    icon: "🎯",
  },
  {
    title: "Sleep Stories & Meditations",
    description: "Enjoy personalized bedtime stories or guided meditations designed to help you relax, unwind, and fall asleep faster.",
    icon: "🌙",
  },
];

const benefits = [
  "Affordable Emotional Care",
  "Instant Emotional Support",
  "Confidential Conversations",
  "Boost Your Mental Health",
  "Effective Stress Relief",
  "Personalized Guidance",
];

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text animate-fade-up">
            Mental Health Therapist.
          </h1>
          <p className="text-xl text-gray-600 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Your AI Companion for Mental Wellness
          </p>
          <button className="mt-8 px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors duration-200 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Get Started
          </button>
          <p className="text-sm text-gray-500 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            Meet your next-generation mental wellness companion.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-xl text-gray-600">
              Meet your next-generation mental wellness companion.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card animate-fade-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-secondaryBlue">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="benefit-item animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Get Started now</h2>
          <p className="text-xl text-gray-600 mb-8">
            Be part of millions people around the world using Soulmate in modern era.
          </p>
          <button className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors duration-200">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
