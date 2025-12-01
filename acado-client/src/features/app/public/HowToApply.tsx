import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const HowToApply: React.FC = () => {
  return (
    <div className="how-to-apply">
      {/* Hero Section */}
      <div className="relative isolate flex items-center justify-center h-[90vh] bg-white dark:bg-black">
        {/* Background Blur Top */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mx-auto text-center px-6 max-w-2xl"
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-8">
            Streamline your application process seamlessly!
          </h1>
          <a href="#how-to-apply" className="inline-block">
            <p className="text-lg text-gray-700 dark:text-white">Read More</p>
            <ChevronDown className="w-8 h-8 mt-2 mx-auto animate-bounce text-gray-800 dark:text-white" />
          </a>
        </motion.div>

        {/* Background Blur Bottom */}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-pink-300 to-indigo-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {/* How to Apply Section */}
      <section id="how-to-apply" className="bg-white dark:bg-gray-900 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            University Application Process
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-10">
            Applying to a university can be a streamlined process if you follow the necessary steps.
            Here's a step-by-step guide to help you navigate effectively.
          </p>

          {/* Timeline Steps with Animation */}
          <div className="space-y-12 pl-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative"
              >
                <div className="absolute -left-3.5 top-1.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-900" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{step.description}</p>
                {step.bullets && (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                    {step.bullets.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HowToApply;

const steps = [
  {
    title: "Step 1: Research and Shortlist Universities",
    description:
      "Start by exploring universities that align with your goals. Consider the following:",
    bullets: [
      "Programs Offered: Match with your interests.",
      "Eligibility Criteria: Check entry requirements.",
      "Location: Country, city, and lifestyle.",
      "Fees and Scholarships: Look into affordability and aid.",
    ],
  },
  {
    title: "Step 2: Check Application Deadlines",
    description:
      "Universities have varying deadlines. Make sure to track:",
    bullets: [
      "Early Applications: Priority consideration.",
      "Regular Deadlines: Standard timelines.",
      "Rolling Admissions: Reviewed as received.",
    ],
  },
  {
    title: "Step 3: Gather Required Documents",
    description:
      "Prepare all necessary documentation including:",
    bullets: [
      "Academic Transcripts",
      "Statement of Purpose (SOP)",
      "Letters of Recommendation (2-3)",
      "English Proficiency Test Scores (TOEFL/IELTS)",
      "Resume/CV and Passport Copy",
    ],
  },
  {
    title: "Step 4: Fill Out the Application Form",
    description:
      "Apply via official portals. Ensure accuracy and completeness.",
    bullets: [
      "Correct personal and academic details.",
      "Upload valid documents.",
      "Pay the fee and review everything before submission.",
    ],
  },
  {
    title: "Step 5: Prepare for Entrance Exams (if applicable)",
    description:
      "Depending on the program, you may need test scores:",
    bullets: [
      "SAT/ACT for undergrad",
      "GRE/GMAT for grad school",
      "IELTS/TOEFL/PTE for language proficiency",
    ],
  },
  {
    title: "Step 6: Submit Your Application",
    description:
      "Double-check everything before hitting submit!",
    bullets: [
      "Verify all fields and documents.",
      "Submit via the university portal.",
      "Save your confirmation receipt.",
    ],
  },
];
