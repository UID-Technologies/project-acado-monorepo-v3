// import React, { useState, useEffect } from "react";
// import { useInterestAreaStore } from "@app/store/learner/interestAreaStore";
// import { fetchInterestArea } from "@services/learner/InterestAreaServices";
// import Loading from "@/components/shared/Loading";
// import { Alert } from "@/components/ui";

// interface InterestAreaProps {
//     setInterestAreaData: (interestAreaData: number[]) => void;
//     selectedAreas: number[];
// }

// const InterestArea: React.FC<InterestAreaProps> = ({ setInterestAreaData, selectedAreas }) => {
//     const { interestArea, setInterestArea, error, setError, loading, setLoading } = useInterestAreaStore();
//     useEffect(() => {
//         setLoading(true);
//         setError('');
//         fetchInterestArea()
//             .then((data) => {
//                 setInterestArea(data);
//                 const defautSelected = data.filter((area_item) => area_item.is_mapped != null).map((area_item) => area_item.id);
//                 setInterestAreaData(defautSelected);
//             })
//             .catch((err) => {
//                 setError(err);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     }, []);

//     const handleInterestArea = (id: number) => {
//         if (selectedAreas.includes(id)) {
//             const filteredAreas = selectedAreas.filter((area) => area !== id);
//             setInterestAreaData(filteredAreas);
//         }
//         else {
//             // add new area to selected areas if not already exists
//             if (selectedAreas.includes(id) === false) {
//                 setInterestAreaData([...selectedAreas, id]);
//             }
//         }
//         console.log("Selected Interest Areas:", selectedAreas);
//     };

//     if (loading) {
//         return <Loading loading={loading} />;
//     }

//     if (error) {
//         return <Alert type="danger" title={error} />;
//     }

//     return (
//         <div className="relative py-5">
//             <div className="dark:border-gray-700 mb-5">
//                 <Alert
//                     type="warning"
//                     title="Answer a few questions to improve your content recommendations"
//                     className="py-2"
//                 />
//             </div>
//             <p className="text-2xl font-semibold text-primary mb-4">What field are you learning for ?</p>
//             <div className="mb-4 flex justify-between items-center">
//                 <p className="text-sm text-gray-500">Select the field you are interested in. You can select multiple fields.</p>
//                 <button className="text-sm text-primary">
//                     Selected {selectedAreas.length} Interest Areas
//                 </button>
//             </div>
//             <form className="">
//                 <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                     {
//                         interestArea.map((item, index) => (
//                             <div>
//                                 <label
//                                     key={`AreaIs-${index}`}
//                                     htmlFor={`interestArea${item.id}`} className="relative flex flex-col p-5 rounded-lg shadow-md cursor-pointer">
//                                     {/* overlay */}
//                                     <span className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></span>
//                                     {/* content */}
//                                     <span className="font-semibold text-gray-500 leading-tight uppercase relative text-white">
//                                         {item.name}
//                                     </span>
//                                     <input
//                                         onChange={() => handleInterestArea(item.id)}
//                                         type="checkbox" name="plan" id={`interestArea${item.id}`} value="hobby" className="absolute h-0 w-0 appearance-none checkbox-card"
//                                         checked={selectedAreas.includes(item.id)}
//                                     />
//                                     <span aria-hidden="true" className="absolute inset-0 border-2 border-primary bg-green-200 bg-opacity-10 rounded-lg">
//                                         <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-primary">
//                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-green-600">
//                                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                             </svg>
//                                         </span>
//                                     </span>
//                                 </label>
//                             </div>
//                         ))
//                     }
//                 </div>
//             </form>
//         </div>
//     )
// }

// export default InterestArea;
import type React from 'react'
import { useEffect } from 'react'
import { useInterestAreaStore } from '@app/store/learner/interestAreaStore'
import { fetchInterestArea } from '@services/learner/InterestAreaServices'
import Loading from '@/components/shared/Loading'
import { Alert } from '@/components/ui'
import { Check } from 'lucide-react'

interface InterestAreaProps {
    setInterestAreaData: (interestAreaData: number[]) => void
    selectedAreas: number[]
}

const InterestArea: React.FC<InterestAreaProps> = ({
    setInterestAreaData,
    selectedAreas,
}) => {
    const {
        interestArea,
        setInterestArea,
        error,
        setError,
        loading,
        setLoading,
    } = useInterestAreaStore()

    useEffect(() => {
        setLoading(true)
        setError('') //This line was added to fix the issue
        fetchInterestArea()
            .then((data) => {
                setInterestArea(data)
                const defautSelected = data
                    .filter((area_item) => area_item.is_mapped != null)
                    .map((area_item) => area_item.id)
                setInterestAreaData(defautSelected)
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [setError]) // setError added as a dependency

    const handleInterestArea = (id: number) => {
        if (selectedAreas.includes(id)) {
            const filteredAreas = selectedAreas.filter((area) => area !== id)
            setInterestAreaData(filteredAreas)
        } else {
            if (selectedAreas.includes(id) === false) {
                setInterestAreaData([...selectedAreas, id])
            }
        }
    }

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert type="danger" title={error} />
    }

    return (
        <div className="relative py-5 px-4 sm:px-6 lg:px-8">
            {/* Alert */}
            <div className="dark:border-gray-700 mb-5">
                <Alert
                    type="warning"
                    title="Answer a few questions to improve your content recommendations"
                    className="py-2"
                />
            </div>

            {/* Title */}
            <p className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                What field are you learning for?
            </p>

            {/* Info and Selected Count */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <p className="text-sm text-gray-500">
                    Select the field you are interested in. You can select
                    multiple fields.
                </p>
                <button className="text-sm text-primary">
                    Selected {selectedAreas.length} Interest Areas
                </button>
            </div>

            {/* Interest Areas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {interestArea.map((item, index) => (
                    <div
                        key={`AreaIs-${index}`}
                        className={`relative aspect-[9/2] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                            selectedAreas.includes(item.id)
                                ? 'ring-2 ring-[#98ff98]'
                                : ''
                        }`}
                        onClick={() => handleInterestArea(item.id)}
                    >
                        {/* Image placeholder */}
                        <img
                            className="absolute inset-0 w-full h-full object-cover"
                            src={item.image || ''}
                            alt={item.name}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60" />

                        {/* Content */}
                        <div className="relative h-full p-4 sm:p-6 flex flex-col">
                            <div className="flex justify-between items-start">
                                <span className="text-white/80 text-xs sm:text-sm font-medium">
                                    INTEREST AREA
                                </span>
                                {selectedAreas.includes(item.id) && (
                                    <div className="bg-[#98ff98] rounded-full p-1">
                                        <Check className="w-4 h-4 text-black" />
                                    </div>
                                )}
                            </div>

                            <h3 className="mt-auto text-base sm:text-xl font-bold text-white uppercase">
                                {item.name}
                            </h3>
                        </div>

                        {/* Hidden Checkbox */}
                        <input
                            onChange={() => handleInterestArea(item.id)}
                            type="checkbox"
                            name="plan"
                            id={`interestArea${item.id}`}
                            value="hobby"
                            className="absolute h-0 w-0 appearance-none checkbox-card"
                            checked={selectedAreas.includes(item.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InterestArea
