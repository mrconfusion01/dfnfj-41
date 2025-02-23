
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full top-4 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 px-6">
          <div className="flex-shrink-0">
            <a href="/" onClick={handleLogoClick} className="text-xl font-semibold">
              Soulmate.ai
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" onClick={scrollToFeatures} className="text-gray-600 hover:text-gray-900">
              Features
            </a>
          </div>
          <div>
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
