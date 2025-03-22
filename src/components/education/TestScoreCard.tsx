
import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface TestScore {
  subject: string;
  score: string;
}

interface TestScoreCardProps {
  name: string;
  date: string;
  scores: TestScore[];
}

const TestScoreCard: React.FC<TestScoreCardProps> = ({ name, date, scores }) => {
  return (
    <GlassCard className="p-8" variant="dark" hoverEffect>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-4">
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <div className="flex items-center text-white/50 text-sm">
              <Calendar size={14} className="mr-2 text-primary/70" />
              <span>{date}</span>
            </div>
          </div>

          <div className="space-y-4 border-l-2 border-primary/30 pl-4">
            {scores.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-white/80">{item.subject}</span>
                <span className="font-medium text-white bg-primary/10 border border-primary/20 px-3 py-1 rounded-md">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default TestScoreCard;
