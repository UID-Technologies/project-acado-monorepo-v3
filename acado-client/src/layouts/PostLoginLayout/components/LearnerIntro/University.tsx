import React, { useState, useEffect } from 'react'
import {
    fetchUniversities,
    appliedUserUniversity,
} from '@services/public/UniversitiesService'
import { useUniversitiesStore } from '@app/store/public/___universitiesStore'
import Loading from '@/components/shared/Loading'
import { Alert } from '@/components/ui'

interface UniversityProps {
    setSelectedUniversities: (universityData: number[]) => void
    selectedUniversities: number[]
}

const University: React.FC<UniversityProps> = ({
    setSelectedUniversities,
    selectedUniversities,
}) => {
    const {
        universities,
        setUniversities,
        loading,
        setLoading,
        error,
        setError,
    } = useUniversitiesStore()
    const [userUniversities, setUserUniversities] = useState<number[]>([])

    const getUniversities = () => {
        fetchUniversities()
            .then((data) => {
                setUniversities(data)
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getUserUniversities = () => {
        appliedUserUniversity()
            .then((data) => {
                setUserUniversities(data)
                setSelectedUniversities(data)
            })
            .catch((err) => {
                console.log(err)
            })
        setSelectedUniversities(userUniversities)
    }

    useEffect(() => {
        setLoading(true)
        setError('')
        getUniversities()
        getUserUniversities()
    }, [])

    if (loading) {
        return <Loading loading={loading} />
    }

    if (error) {
        return <Alert title={`Error: ${error}`} showIcon={true} />
    }

    const handleInterestArea = (id: number) => {
        if (selectedUniversities.includes(id)) {
            const filteredAreas = selectedUniversities.filter(
                (university) => university !== id,
            )
            setSelectedUniversities(filteredAreas)
        } else {
            setSelectedUniversities([...selectedUniversities, id])
        }
        console.log('Selected Interest Areas:', selectedUniversities)
    }

    return (
        <div className="py-4 px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <p className="text-xl sm:text-2xl font-semibold text-primary">
                Universities
            </p>

            {/* Description + Selected Count */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-gray-500 text-sm">
                    Select the universities you are interested in
                </p>
                <p className="text-gray-500 text-sm">
                    {selectedUniversities.length} Selected
                </p>
            </div>

            {/* Grid of Universities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {universities.map((item, index) => (
                    <label
                        key={index}
                        htmlFor={`university${item.id}`}
                        className="relative flex flex-col gap-4 p-4 rounded-lg shadow-md cursor-pointer overfowhidden"
                    >
                        {/* Overlay */}
                        <span className="absolute inset-0 bg-black bg-opacity-40 rounded-lg z-0" />

                        {/* University Info */}
                        <span className="relative z-10 flex items-center gap-3">
                            <img
                                src={item.logo}
                                alt={item.name}
                                className="w-12 h-12 rounded-full bg-gray-200"
                            />
                            <span className="uppercase text-primary font-semibold text-sm sm:text-base">
                                {item.name}
                            </span>
                        </span>

                        {/* Hidden Checkbox */}
                        <input
                            onChange={() => handleInterestArea(item?.id)}
                            type="checkbox"
                            name="plan"
                            id={`university${item.id}`}
                            value={item.id}
                            className="absolute h-0 w-0 appearance-none checkbox-card"
                            checked={selectedUniversities.includes(item?.id)}
                        />

                        {/* Checkmark Overlay */}
                        {selectedUniversities.includes(item?.id) && (
                            <span className="absolute inset-0 border-2 border-primary bg-green-200/10 rounded-lg z-10 pointer-events-none">
                                <span className="absolute top-3 right-3 h-6 w-6 inline-flex items-center justify-center rounded-full bg-primary">
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
        </div>
    )
}

export default University
