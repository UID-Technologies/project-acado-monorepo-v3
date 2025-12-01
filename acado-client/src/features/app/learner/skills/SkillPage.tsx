import React, { useState, useEffect } from "react";
import { useSkillsSuggestionsStore } from "@app/store/learner/portfolioStore";
import {
  getSkillsSuggestions,
  getUserSkills,
  addUserSkill,
  deleteUserSkill,
} from "@services/learner/Portfolio";
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { useSnackbar } from "notistack";

const SkillPage: React.FC = () => {
  const { suggestions, setSuggestions, error, setError, loading, setLoading } = useSkillsSuggestionsStore();
  const [skillMappings, setSkillMappings] = useState<any[]>([]); // Stores the mapping list
  const { enqueueSnackbar } = useSnackbar();

  // Fetch skills suggestions
  useEffect(() => {
    setLoading(true);
    setError("");
    getSkillsSuggestions()
      .then((data) => setSuggestions(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch user skill mappings (and update state)
  const fetchUserSkills = () => {
    getUserSkills()
      .then((data) => setSkillMappings(data))
      .catch((err) => console.log(err));
  };

  // Initial fetch of user skills
  useEffect(() => {
    fetchUserSkills();
  }, []);

  const getSelectedSkillIds = () => skillMappings.map((item) => item.skill_id);

  if (loading) return <Loading loading={loading} />;
  if (error) return <Alert type="danger" title={error} />;

  const handleInterestArea = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    if (isChecked) {
      // Add skill
      addUserSkill({ skill_id: skillId, self_proficiency: "100" })
        .then(() => {
          enqueueSnackbar("Skill added successfully", { variant: "success" });
          fetchUserSkills(); // Refresh mapping list
        })
        .catch((err) => console.log(err));
    } else {
      // Find the mapping ID for this skill
      const mapping = skillMappings.find((item) => item.skill_id === skillId);
      if (mapping) {
        deleteUserSkill(mapping.id)
          .then(() => {
            enqueueSnackbar("Skill removed successfully", { variant: "success" });
            fetchUserSkills(); // Refresh mapping list
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <div className="py-4">
      <p className="text-2xl font-semibold text-primary">
        What skills are you interested in?
      </p>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {suggestions.map((item, index) => (
          <label
            key={index}
            htmlFor={`interestArea${item.id}`}
            className="relative flex flex-col p-5 rounded-[9px] shadow-md cursor-pointer border border-primary"
          >
            {/* Overlay */}
            <span className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></span>
            {/* Content */}
            <span className="font-bold text-gray-900 relative">
              <span className="uppercase text-primary">{item.name}</span>
            </span>
            <input
              onChange={handleInterestArea}
              type="checkbox"
              name="plan"
              id={`interestArea${item.id}`}
              value={item.id}
              checked={getSelectedSkillIds().includes(item.id)}
              className="absolute h-0 w-0 appearance-none checkbox-card"
            />
            {/* Checkmark styling */}
            <span aria-hidden="true" className="hidden absolute inset-0 border-2 border-primary bg-green-200 bg-opacity-10 rounded-lg">
              <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-600">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SkillPage;
