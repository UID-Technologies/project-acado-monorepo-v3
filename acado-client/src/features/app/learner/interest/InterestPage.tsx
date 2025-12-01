import React, { useState, useEffect } from "react";
import { useInterestAreaStore } from "@app/store/learner/interestAreaStore";
import { fetchInterestArea, saveUserInterestArea } from "@services/learner/InterestAreaServices";
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { useSnackbar } from "notistack";
import cookiesStorage from "@services/storage/cookiesStorage";
import { Navigate, useNavigate } from "react-router-dom";

export default function InterestPage() {
  const {
    interestArea,
    setInterestArea,
    error,
    setError,
    loading,
    setLoading,
  } = useInterestAreaStore();
  const [userAreas, setUserAreas] = useState<number[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  



//   useEffect(() => {
//     const firstLogin = cookiesStorage.getItem('firstLogin')
//     if (firstLogin === null) {
//         cookiesStorage.setItem('firstLogin', 'true')
//         navigate('/complete-profile')
//     }
// }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchInterestArea();
        setInterestArea(data);

        const defaultSelected = data
          .filter((item) => item.is_mapped != null)
          .map((item) => item.id);

        setSelectedAreas(defaultSelected);
        setUserAreas(defaultSelected);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setInterestArea, setLoading, setError]);

  const handleSelectionChange = (id: number) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((area) => area !== id) : [...prev, id]
    );
  };

  const saveInterestArea = async () => {
    if (selectedAreas.length === 0) {
      enqueueSnackbar("Please select at least one interest area", { variant: "error" });
      return;
    }

    if (JSON.stringify(selectedAreas) === JSON.stringify(userAreas)) {
      enqueueSnackbar("No changes found", { variant: "info" });
      return;
    }

    try {
      await saveUserInterestArea(selectedAreas);
      enqueueSnackbar("Interest area saved successfully", { variant: "success" });
      setUserAreas(selectedAreas);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save interest areas";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  if (loading && interestArea?.length === 0) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <Alert type="danger" title={`Error: ${error}`} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-serif">
        Which field are you interested in?
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Select carefully to match your interests, you can always change it later.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interestArea.map((item) => (
          <label
            key={item.id}
            htmlFor={`interestArea${item.id}`}
            className="relative flex flex-col p-5 rounded-lg border border-primary shadow-md cursor-pointer h-24 w-full"
          >
            <span className="absolute inset-0 dark:bg-black bg-opacity-50 rounded-lg"></span>
            <span className="font-semibold text-gray-500 leading-tight uppercase mb-3 relative text-white">
              &nbsp;
            </span>
            <span className="font-bold text-gray-900 relative w-full">
              <span className="text-xl uppercase text-primary">
                {item.name}
              </span>
            </span>
            <input
              onChange={() => handleSelectionChange(item.id)}
              type="checkbox"
              id={`interestArea${item.id}`}
              className="absolute h-0 w-0 appearance-none checkbox-card"
              checked={selectedAreas.includes(item.id)}
            />
            {selectedAreas.includes(item.id) && (
              <span
                aria-hidden="true"
                className="absolute inset-0 border-2 border-primary bg-green-200 bg-opacity-10 rounded-lg"
              >
                <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 text-green-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </span>
            )}
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={saveInterestArea}
          className="bg-primary text-ac-dark font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-darkPrimary"
        >
          Save Interest Area
        </button>
      </div>
    </div>
  );
}
