
import React from 'react';
import { Calendar, ChevronDown, ChevronUp, Star, Download, HelpCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import FinlandIcon from '../../assets/finland.svg';
import BangladeshIcon from '../../assets/bangladesh.svg';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import GlassCard from '../ui/GlassCard';

interface Course {
  name: string;
  grade: string;
}

interface FeaturedItem {
  title: string;
  description: string;
  grade: string;
}

interface EducationItem {
  institution: string;
  location: string;
  degree: string;
  period: string;
  featured?: FeaturedItem[];
  courses?: Course[];
  transcript?: string;
}

interface EducationCardProps {
  education: EducationItem;
  index: number;
  openCollapsible: boolean;
  setOpenCollapsible: React.Dispatch<React.SetStateAction<boolean>>;
}

const EducationCard: React.FC<EducationCardProps> = ({ education, index, openCollapsible, setOpenCollapsible }) => {
  const handleDownloadTranscript = () => {
    // This would be replaced with actual file download logic
    alert('Transcript download will be implemented. This is a placeholder.');
  };

  const getLocationIcon = (location: string) => {
    if (location === 'Oulu, Finland') {
      return <img src={FinlandIcon} alt="Finland Icon" className="w-6 h-6 mr-2" />;
    } else if (location === 'Dhaka, Bangladesh') {
      return <img src={BangladeshIcon} alt="Bangladesh Icon" className="w-6 h-6 mr-2" />;
    }
    return null;
  };

  return (
    <GlassCard className="p-8" variant={index === 0 ? 'neon' : 'default'} hoverEffect>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-shrink-0 flex md:flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <GraduationCap size={20} />
          </div>

          <div className="flex items-center text-white/50 text-sm">
            <Calendar size={14} className="mr-2 text-primary/70" />
            <span>{education.period}</span>
          </div>

          {/* Download Transcript Button - Only for the first education entry */}
          {index === 0 && education.transcript && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownloadTranscript}
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                  >
                    <Download size={14} className="mr-2" />
                    Transcript
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download official transcript</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
            <h3 className="text-xl font-bold text-white">{education.institution}</h3>
            <div className="flex items-center text-white/50 text-sm">
              {getLocationIcon(education.location)}
              <span>{education.location}</span>
            </div>
          </div>

          <p className="text-lg text-primary mb-4">{education.degree}</p>

          {/* Featured Items Component */}
          {education.featured && <FeaturedItems featured={education.featured} />}

          {/* Courses Component */}
          {education.courses && (
            <CoursesSection 
              courses={education.courses} 
              openCollapsible={openCollapsible} 
              setOpenCollapsible={setOpenCollapsible} 
            />
          )}
        </div>
      </div>
    </GlassCard>
  );
};

// Featured Items Component
interface FeaturedItemsProps {
  featured: FeaturedItem[];
}

const FeaturedItems: React.FC<FeaturedItemsProps> = ({ featured }) => {
  return (
    <div className="mt-4 mb-6">
      <h4 className="text-md font-medium text-white/80 mb-3 flex items-center">
        <Star size={14} className="mr-2 text-primary/70" />
        Featured
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {featured.map((item, i) => (
          <div key={i} className="flip-card relative h-32">
            <div className="flip-card-inner w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
              <div className="flip-card-front absolute w-full h-full backface-hidden bg-primary/5 border border-primary/20 text-white/90 p-3 rounded-md">
                <h5 className="font-medium text-primary">{item.title}</h5>
                <p className="text-sm text-white/70 mt-1">{item.description}</p>
              </div>
              <div className="flip-card-back absolute w-full h-full backface-hidden rotate-y-180 bg-primary/10 border border-primary/30 text-white p-3 rounded-md flex flex-col justify-center items-center">
                <span className="text-white/80 mb-2">Grade</span>
                <span className="text-2xl font-bold text-primary">{item.grade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Courses Section Component
interface CoursesSectionProps {
  courses: Course[];
  openCollapsible: boolean;
  setOpenCollapsible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, openCollapsible, setOpenCollapsible }) => {
  return (
    <div className="mt-6">
      <Collapsible open={openCollapsible} onOpenChange={setOpenCollapsible}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-md font-medium text-white/80 flex items-center">
            Relevant Coursework
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle size={14} className="ml-2 text-primary/70 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hover over courses to see grades</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          <CollapsibleTrigger className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-white/70 hover:bg-primary/10 hover:text-white transition-colors">
            {openCollapsible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </CollapsibleTrigger>
        </div>

        {/* Always show first 3 courses, toggle the rest */}
        <div className="flex flex-wrap gap-2">
          {courses.slice(0, 3).map((course, i) => (
            <CourseItem key={i} course={course} />
          ))}

          <CollapsibleContent className="flex flex-wrap gap-2">
            {courses.slice(3).map((course, i) => (
              <CourseItem key={i} course={course} />
            ))}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

// Individual Course Item
interface CourseItemProps {
  course: Course;
}

const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-md text-sm transition-all hover:bg-primary/10 hover:border-primary/30 hover:text-white cursor-help">
          {course.name}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto bg-black/80 border border-primary/20 text-white backdrop-blur-lg hovercard-content">
        <div className="flex justify-between items-center">
          <span>{course.name}</span>
          <span className="ml-4 font-bold text-primary">{course.grade}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export { GraduationCap };
export default EducationCard;
