import React from 'react';
import SectionHeader from './SectionHeader';
import { Calendar, FileText, GraduationCap, School, BookOpen } from 'lucide-react';
import finlandMarker from '@/assets/finland.svg?url';
import bangladeshMarker from '@/assets/bangladesh.svg?url';

const TRANSCRIPT_URL = 'https://a3s.fi/swift/v1/nayreed/opintosuoritusote.pdf';

const courseworkGroups = [
  {
    label: 'Core',
    courses: [
      { name: 'Calculus I', grade: '5' },
      { name: 'Calculus II', grade: '5' },
      { name: 'Matrix Algebra', grade: '5' },
      { name: 'Probability & Mathematical Statistics', grade: '5' },
      { name: 'Differential Equations', grade: '5' },
      { name: 'Introduction to Computer Systems', grade: '4' },
      { name: 'Circuit Theory 1', grade: '5' },
      { name: 'Circuit Theory 2', grade: '5' },
    ],
  },
  {
    label: 'Specialized',
    courses: [
      { name: 'Machine Learning', grade: '5' },
      { name: 'Deep Learning', grade: '5' },
      { name: 'Telecommunication Engineering', grade: '5' },
      { name: 'Digital Filters', grade: '3' },
      { name: 'Simulations & Tools for Telecommunications', grade: '4' },
      { name: 'Electronic Measurement Techniques', grade: '5' },
      { name: 'Electronics Design', grade: '4' },
      { name: 'Optical Systems', grade: '5' },
    ],
  },
];

const satScores = [
  { subject: 'Total', score: '1360' },
  { subject: 'Math', score: '740' },
  { subject: 'Reading & Writing', score: '620' },
];

const completedCredits = 132;
const requiredCredits = 180;
const progressPercent = (completedCredits / requiredCredits) * 100;

interface EducationMetaProps {
  date: string;
  location: string;
  marker: string;
}

const EducationMeta = ({ date, location, marker }: EducationMetaProps) => (
  <div className="flex flex-col gap-2 md:items-end shrink-0">
    <span className="inline-flex items-center justify-center gap-2 font-mono text-xs text-charcoal text-center border border-hairline rounded-full px-3 py-1.5">
      <Calendar size={12} />
      {date}
    </span>
    <span className="inline-flex items-center justify-center md:justify-end gap-2 text-xs text-mute text-center md:text-right">
      <img src={marker} alt="" aria-hidden="true" className="w-3.5 h-3.5 object-contain shrink-0" />
      {location}
    </span>
  </div>
);

const Education = () => {
  return (
    <section id="education" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader title="Education" />

        <div className="space-y-5">
          {/* University of Oulu */}
          <div className="card-hairline p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink">
                    University of Oulu (Oulun Yliopisto)
                  </h3>
                  <p className="text-fade mt-1">
                    BSc (Technology) in Electronics and Communications Engineering
                  </p>
                </div>
              </div>
              <EducationMeta date="Aug 2024 - Present" location="Oulu, Finland" marker={finlandMarker} />
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-fade">Degree progress</span>
                <span className="font-mono text-xs text-charcoal">
                  {completedCredits} / {requiredCredits} ECTS
                </span>
              </div>
              <div className="w-full h-1.5 bg-soft border border-hairline rounded-full overflow-hidden">
                <div
                  className="h-full progress-fill rounded-full"
                  style={{ '--progress-width': `${progressPercent}%` } as React.CSSProperties}
                />
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {courseworkGroups.map((group) => (
                <div key={group.label}>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute mb-3">
                    {group.label} coursework
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.courses.map((course) => (
                      <span key={course.name} className="chip">
                        {course.name}
                        <span className="ml-2 text-ink font-medium">{course.grade}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href={TRANSCRIPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-secondary !py-2 text-sm"
              >
                <FileText size={14} />
                Official Transcript
              </a>
            </div>
          </div>

          {/* SAT */}
          <div className="card-hairline p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink">
                    Scholastic Assessment Test (SAT)
                  </h3>
                </div>
              </div>
              <EducationMeta date="Dec 2023" location="Dhaka, Bangladesh" marker={bangladeshMarker} />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {satScores.map((item) => (
                <div
                  key={item.subject}
                  className="bg-soft border border-hairline rounded-xl px-2 sm:px-4 py-3 text-center"
                >
                  <p className="font-display text-2xl font-bold text-ink">{item.score}</p>
                  <p className="text-xs text-mute mt-1">{item.subject}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HSC */}
          <div className="card-hairline p-4 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
                    <School size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      Shaheed Bir Bikram Ramiz Uddin Cantonment College
                    </h3>
                  </div>
                </div>
                <p className="text-fade mt-3 sm:ml-[60px] whitespace-nowrap text-[10px] min-[420px]:text-xs sm:text-base">
                  Higher Secondary Certificate (HSC), Science · GPA 4.75
                </p>
              </div>
              <EducationMeta
                date="Feb 2022 - Nov 2023"
                location="Dhaka, Bangladesh"
                marker={bangladeshMarker}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
