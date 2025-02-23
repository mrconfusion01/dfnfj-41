
import { useState, useEffect } from "react";

interface TypingAnimationProps {
  phrases: string[];
}

export const TypingAnimation = ({ phrases }: TypingAnimationProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = phrases[currentPhrase];
    const shouldDelete = isDeleting && displayText.length > 0;
    const shouldType = !isDeleting && displayText.length < currentText.length;

    if (shouldDelete) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, 50);
      return () => clearTimeout(timer);
    }

    if (shouldType) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 100);
      return () => clearTimeout(timer);
    }

    if (!shouldDelete && !shouldType) {
      const timer = setTimeout(() => {
        if (isDeleting) {
          setCurrentPhrase(prev => (prev + 1) % phrases.length);
          setIsDeleting(false);
        } else {
          setIsDeleting(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [displayText, currentPhrase, isDeleting, phrases]);

  return (
    <div className="h-16">
      <p className="text-2xl font-light">
        <span>{displayText}</span>
        <span className="ml-1 animate-pulse">|</span>
      </p>
    </div>
  );
};
