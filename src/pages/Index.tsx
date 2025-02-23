
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

  return <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* Base Gradient - Soft minimal gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D3E4FD] via-[#F1F0FB] to-[#E5DEFF]" />
        
        {/* Curved Topographic Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50C20 50 20 30 40 30C60 30 60 50 80 50C100 50 100 30 120 30' stroke='rgba(255,255,255,0.05)' fill='none' stroke-width='2'/%3E%3Cpath d='M0 60C20 60 20 40 40 40C60 40 60 60 80 60C100 60 100 40 120 40' stroke='rgba(255,255,255,0.03)' fill='none' stroke-width='2'/%3E%3Cpath d='M0 70C20 70 20 50 40 50C60 50 60 70 80 70C100 70 100 50 120 50' stroke='rgba(255,255,255,0.02)' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />
        
        {/* Minimal Gradient Blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D3E4FD] to-[#E5DEFF] rounded-full blur-3xl opacity-40" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)] rounded-full" />
        </div>
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px]">
          <div className="absolute inset-0 bg-gradient-to-bl from-[#F1F0FB] to-[#E5DEFF] rounded-full blur-3xl opacity-30" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)] rounded-full" />
        </div>
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-tl from-[#E5DEFF] to-[#D3E4FD] rounded-full blur-3xl opacity-30" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)] rounded-full" />
        </div>
      </div>

      <Navbar />
      
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

      <section id="features" className="py-20 px-4 bg-white/80 backdrop-blur-sm">
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

      <section className="py-20 px-4 overflow-hidden bg-white/70 backdrop-blur-sm">
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

      <section className="py-20 px-4 text-center relative bg-white/80 backdrop-blur-sm">
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
