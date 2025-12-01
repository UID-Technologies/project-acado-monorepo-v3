import { Alert } from "@/components/ui";
import React, { useState } from "react";
import Skills from "./Skills";
import InterestArea from "./InterestArea";
import University from "./University";
import { saveUserInterestArea } from "@services/learner/InterestAreaServices";
import { addUserInUniversity } from "@services/public/UniversitiesService";
import { changeStatusofUserInterestArea } from "@services/learner/InterestAreaServices";
import { useSnackbar } from "notistack";
import CompleteProfile from "@features/app/learner/profile";

interface LearnerIntroStepPopupProps {
    handlePopup: () => void;
}

const LearnerIntroStepPopup: React.FC<LearnerIntroStepPopupProps> = ({ handlePopup }) => {
    // Data
    const [interestAreaData, setInterestAreaData] = useState<number[]>([]);
    const [universities, setUniversities] = useState<number[]>([]);
    
    // State
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { enqueueSnackbar } = useSnackbar();

    const handleNext = () => {
        if (currentStep === 1) {
            enqueueSnackbar("Profile Completed Successfully", { variant: "success" });
            setCurrentStep((prev) => prev + 1);
        } 
        else if (currentStep === 2) {
            const uniqueInterestAreaData = interestAreaData.filter((value, index, self) => self.indexOf(value) === index);
            saveUserInterestArea(uniqueInterestAreaData)
                .then(() => {
                    enqueueSnackbar("Interest Area Saved Successfully", { variant: "success" });
                    setCurrentStep((prev) => prev + 1);
                })
                .catch((err) => console.error(err));
        } 
        else if (currentStep === 3) {
            enqueueSnackbar("Skills Saved Successfully", { variant: "success" });
            setCurrentStep((prev) => prev + 1);
        } 
        else {
            enqueueSnackbar("Universities Saved Successfully", { variant: "success" });
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setCurrentStep((prev) => prev - 1);

    const handleSkip = () => {
        changeStatusofUserInterestArea()
            .then(() => handlePopup())
            .catch(error => console.error(error));
    };

    const handleSave = () => {
        addUserInUniversity(universities)
            .then(() => {
                changeStatusofUserInterestArea()
                    .then(() => {
                        enqueueSnackbar("Universities Saved Successfully", { variant: "success" });
                        handlePopup();
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="fixed inset-0 bg-slate-950 bg-opacity-40 flex items-center justify-center z-50">
            <div className="w-full h-[100vh] rounded-lg bg-white dark:bg-gray-800 flex flex-col overflow-y-auto">
                
                {/* Content Section */}
                <div className="flex-grow px-5 overflow-y-auto">
                    {currentStep === 1 && <CompleteProfile />}
                    {currentStep === 2 && <InterestArea selectedAreas={interestAreaData} setInterestAreaData={setInterestAreaData} />}
                    {currentStep === 3 && <Skills />}
                    {currentStep === 4 && <University setSelectedUniversities={setUniversities} selectedUniversities={universities} />}
                </div>

                {/* Footer Section */}
                <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                    >
                        Skip
                    </button>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleBack}
                            className={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition ${
                                currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={currentStep === 1}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={currentStep === 4 ? handleSave : handleNext}
                            className="px-4 py-2 bg-primary text-ac-dark rounded-md hover:bg-primary-dark transition"
                        >
                            {currentStep === 1
                                ? "Complete Profile"
                                : currentStep === 2
                                ? `Save ${interestAreaData.length} Interest Areas`
                                : currentStep === 3
                                ? "Save Skills"
                                : `Save ${universities.length} Selected Universities`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnerIntroStepPopup;
