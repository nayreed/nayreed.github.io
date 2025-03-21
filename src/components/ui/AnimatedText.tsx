
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  animation?: 'fade-in' | 'fade-in-up' | 'blur-in';
}

const AnimatedText = ({ 
  text, 
  className, 
  delay = 0, 
  tag: Tag = 'span',
  animation = 'fade-in-up'
}: AnimatedTextProps) => {
  return (
    <Tag className={cn("block", className)}>
      {text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split('').map((char, charIndex) => (
            <span
              key={`${wordIndex}-${charIndex}`}
              className={cn(
                "inline-block opacity-0",
                animation === 'fade-in' && "animate-fade-in",
                animation === 'fade-in-up' && "animate-fade-in-up",
                animation === 'blur-in' && "animate-blur-in"
              )}
              style={{ 
                animationDelay: `${delay + ((wordIndex * 0.1) + (charIndex * 0.025))}s`,
                animationFillMode: 'forwards' 
              }}
            >
              {char}
            </span>
          ))}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </Tag>
  );
};

export default AnimatedText;
