import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

const features = [
  {
    title: "Mindful Moments",
    description: "Take a breather with short, guided mindfulness exercises to calm your mind and body in just a few minutes.",
    icon: (
      <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
        <span className="text-2xl">✨</span>
      </div>
    ),
  },
  {
    title: "Emotional First Aid Kit",
    description: "Quick-access tools for moments of crisis, including grounding exercises, breathing techniques, and crisis hotline connections",
    icon: (
      <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
        <span className="text-2xl">🎯</span>
      </div>
    ),
  },
  {
    title: "Sleep Stories & Meditations",
    description: "Enjoy personalized bedtime stories or guided meditations designed to help you relax, unwind, and fall asleep faster.",
    icon: (
      <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
        <span className="text-2xl">🌙</span>
      </div>
    ),
  },
];

const benefits = [
  "Affordable Emotional Care",
  "Instant Emotional Support",
  "Confidential Conversations",
  "Boost Your Mental Health",
  "Effective Stress Relief",
  "Personalized Guidance",
  "Empower Your Mind",
  "24/7 Support Access",
];

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen bg-pattern overflow-hidden">
      {/* Decorative Elements */}
      <svg className="absolute top-0 left-0 w-full h-[800px] -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M0,0 C20,20 50,20 100,0 L100,100 L0,100 Z"
          className="fill-[#E8EFFF]/30"
        />
      </svg>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title">
            Mental Health Therapist<span className="text-[#4F46E5]">.</span>
          </h1>
          <p className="hero-subtitle">
            Your AI Companion for Mental Wellness
          </p>
          <button className="get-started-button group">
            <span>Get Started</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              className="transform group-hover:translate-x-1 transition-transform"
            >
              <path 
                d="M4.16666 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" 
                stroke="currentColor" 
                strokeWidth="1.67" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className="hero-description">
            Powered by AI, designed with care, and here to elevate your emotional well-being to new heights.
          </p>
          
          {/* Scroll Indicator */}
          <button 
            className="absolute left-1/2 bottom-8 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-bounce">
              <path 
                d="M12 5L12 19M12 19L19 12M12 19L5 12" 
                stroke="#4F46E5" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-primary text-sm">⭐ Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-[450] text-[#1C1C1C] leading-tight">
              Meet your next-generation mental<br />wellness companion.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-8 rounded-3xl bg-white hover:shadow-lg transition-shadow duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-[450] mb-4 text-[#1C1C1C]">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-full space-y-4">
          <div className="flex gap-4 sliding-container">
            {[...benefits.slice(0, 4), ...benefits.slice(0, 4)].map((benefit, index) => (
              <div
                key={`${benefit}-${index}-1`}
                className="benefit-item"
              >
                {benefit}
              </div>
            ))}
          </div>
          <div className="flex gap-4 sliding-container" style={{ animationDirection: 'reverse' }}>
            {[...benefits.slice(4), ...benefits.slice(4)].map((benefit, index) => (
              <div
                key={`${benefit}-${index}-2`}
                className="benefit-item"
              >
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 px-4 text-center relative bg-gradient-to-b from-white via-[#E8EFFF] to-transparent backdrop-blur-sm">
        <svg className="decorative-line absolute bottom-0 left-1/2 w-96 h-96 -z-10 transform -translate-x-1/2" viewBox="0 0 200 200">
          <path d="M 0,100 C 50,150 150,50 200,100" />
        </svg>
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
