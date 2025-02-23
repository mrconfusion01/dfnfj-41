
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const features = [{
  title: "Mindful Moments",
  description: "Take a breather with short, guided mindfulness exercises to calm your mind and body in just a few minutes.",
  icon: <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
        <span className="text-2xl">✨</span>
      </div>
}, {
  title: "Emotional First Aid Kit",
  description: "Quick-access tools for moments of crisis, including grounding exercises, breathing techniques, and crisis hotline connections",
  icon: <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
        <span className="text-2xl">🎯</span>
      </div>
}, {
  title: "Sleep Stories & Meditations",
  description: "Enjoy personalized bedtime stories or guided meditations designed to help you relax, unwind, and fall asleep faster.",
  icon: <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white">
        <span className="text-2xl">🌙</span>
      </div>
}];

const benefits = ["Affordable Emotional Care", "Instant Emotional Support", "Confidential Conversations", "Boost Your Mental Health", "Effective Stress Relief", "Personalized Guidance", "Empower Your Mind", "24/7 Support Access"];

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return <div className="min-h-screen bg-pattern relative">
      {/* Hero Background */}
      <div className="hero-background" />

      {/* Decorative Elements */}
      <svg className="decorative-line absolute top-20 left-0 w-64 h-64 -z-10" viewBox="0 0 200 200">
        <path d="M 0,100 C 20,80 50,20 100,100 S 180,120 200,100" />
      </svg>
      <svg className="decorative-line absolute top-96 right-0 w-96 h-96 -z-10" viewBox="0 0 200 200">
        <path d="M 0,100 C 50,150 150,50 200,100" />
      </svg>

      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 py-[100px]">
          <div className="overflow-hidden">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text tracking-tight opacity-0 animate-reveal-text" style={{
            animationDelay: "0.2s"
          }}>
              Mental Health Therapist.
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-xl text-gray-600 leading-relaxed opacity-0 animate-reveal-text" style={{
            animationDelay: "0.4s"
          }}>
              Your AI Companion for Mental Wellness
            </p>
          </div>
          <div className="overflow-hidden">
            <button 
              onClick={handleGetStarted}
              className="mt-8 px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors duration-200 opacity-0 animate-reveal-button" 
              style={{
                animationDelay: "0.6s"
              }}
            >
              Get Started
            </button>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-gray-500 opacity-0 animate-reveal-text" style={{
            animationDelay: "0.8s"
          }}>
              Powered by AI, designed with care, and here to elevate your emotional well-being to new heights.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl text-zinc-950">🔷 Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-[450] text-[#1C1C1C] leading-tight">
              Meet your next-generation mental<br />wellness companion.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => <div key={feature.title} className="p-8 rounded-3xl bg-white hover:shadow-lg transition-shadow duration-300 animate-fade-up" style={{
            animationDelay: `${index * 0.2}s`
          }}>
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-[450] mb-4 text-[#1C1C1C]">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-full space-y-4">
          <div className="flex gap-4 sliding-container">
            {[...benefits.slice(0, 4), ...benefits.slice(0, 4)].map((benefit, index) => <div key={`${benefit}-${index}-1`} className="benefit-item">
                {benefit}
              </div>)}
          </div>
          <div className="flex gap-4 sliding-container" style={{
          animationDirection: 'reverse'
        }}>
            {[...benefits.slice(4), ...benefits.slice(4)].map((benefit, index) => <div key={`${benefit}-${index}-2`} className="benefit-item">
                {benefit}
              </div>)}
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
          <button 
            onClick={handleGetStarted}
            className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>;
}
