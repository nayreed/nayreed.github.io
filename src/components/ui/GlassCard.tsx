
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: 'default' | 'dark' | 'neon';
}

const GlassCard = ({ 
  children, 
  className, 
  hoverEffect = false, 
  variant = 'default',
  ...props 
}: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "relative rounded-xl p-6 transition-all duration-300 overflow-hidden",
        variant === 'default' && "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg",
        variant === 'dark' && "bg-black/40 backdrop-blur-lg border border-white/5 shadow-lg",
        variant === 'neon' && "bg-black/30 backdrop-blur-md border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        hoverEffect && "hover:bg-white/10 hover:shadow-xl hover:border-white/20 hover:scale-[1.01]",
        variant === 'neon' && hoverEffect && "hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:border-primary/40",
        className
      )}
      {...props}
    >
      {variant === 'neon' && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
