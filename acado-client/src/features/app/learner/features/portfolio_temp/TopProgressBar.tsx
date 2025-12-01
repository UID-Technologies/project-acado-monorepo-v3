import { useEffect, useState } from 'react';

interface Step {
  id: number;
  label: string;
  sectionId: string;
}

const steps: Step[] = [
  { id: 1, label: 'Basic Info', sectionId: 'basic-info' },
  { id: 2, label: 'Education', sectionId: 'education' },
  { id: 3, label: 'Experience', sectionId: 'experience' },
  { id: 4, label: 'Certifications', sectionId: 'certifications' },
  { id: 5, label: 'Skills', sectionId: 'skills' },
  { id: 6, label: 'Projects', sectionId: 'projects' },
  // { id: 7, label: 'Awards', sectionId: 'awards' },
  // { id: 8, label: 'Interests', sectionId: 'interests' },
];

export function ProgressBar() {
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let foundActive = false;
  
      for (let i = 0; i < steps.length; i++) {
        const section = document.getElementById(steps[i].sectionId);
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
  
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveStep(steps[i].id);
            foundActive = true;
            break;
          }
        }
      }
  
      // 👇 If no section matched and we're at the bottom of the page, set to last step
      if (!foundActive && window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        setActiveStep(steps[steps.length - 1].id);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden rounded-lg rounded-t-none sm:block sticky top-16 bg-white dark:bg-gray-900 p-4 shadow-md mb-6 overflow-x-auto z-10">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 text-center">
            <div className="flex items-center">
              <button
                onClick={() => scrollToSection(step.sectionId)}
                className="flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step.id <= activeStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] flex-grow mx-2 transition-colors ${
                    step.id < activeStep
                      ? 'bg-primary'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
            <span className="mt-1 px-3 text-xs text-gray-700 dark:text-gray-300 block">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
