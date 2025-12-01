import React, { useState } from 'react'
import {
    addUserSkill,
    deleteUserSkill,
} from '@services/learner/Portfolio'
import Loading from '@/components/shared/Loading'
import { Input } from '@/components/ui'
import { useSkillsSuggestions, useUserSkills } from '@app/hooks/data/useSkills'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const Skills: React.FC = () => {

    const { data: suggestions = [], isLoading } = useSkillsSuggestions();
    const { data: userSkills = [], isLoading: isLoadingUserSkills } = useUserSkills();

    const queryClient = useQueryClient()

    const [searchTerm, setSearchTerm] = useState('')


    const addSkillMutation = useMutation({
        mutationFn: addUserSkill,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['user-skills'] }); }
    })


    const handleAddSkill = async (skillId: number) => {
        const data = {
            skill_id: `${skillId}`,
            self_proficiency: '100'
        }
        addSkillMutation.mutate(data);
    }

    const removeSkillMutation = useMutation({
        mutationFn: deleteUserSkill,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['user-skills'] }); }
    })

    const handleRemoveSkill = async (skillId: number) => {
        removeSkillMutation.mutate(`${skillId}`);
    }


    // not user skills
    const filteredSuggestions = suggestions.filter((suggestion) => {
        const alreadySelected = userSkills.some(
            (userSkill) => userSkill.skill_id === suggestion.id
        )
        const matchesSearch = suggestion.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        return !alreadySelected && matchesSearch
    })

    if (isLoading || isLoadingUserSkills) {
        return <Loading loading={isLoading || isLoadingUserSkills} />
    }


    return (
        <div className="py-4 px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <p className="text-xl sm:text-2xl font-semibold text-primary">
                What skills are you interested in?
            </p>

            {/* Description and Selected Count */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-gray-500 text-sm">
                    Select the skills you are interested in learning.
                </p>
                <span className="text-gray-500 text-sm">
                    {userSkills.length} selected
                </span>
            </div>

            {/* Search Input */}
            <div className="mt-4">
                <Input
                    type="text"
                    placeholder="Search skills..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Selected Skills Chips */}
            {userSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {userSkills.map((skillData, index) => {
                        return (
                            <div
                                key={`user-skill-${skillData.id}-${index}`}
                                className="flex items-center px-3 py-1 bg-primary text-ac-dark rounded-full text-sm"
                            >
                                <span>{skillData.name}</span>
                                <button
                                    className="ml-2 text-ac-dark hover:text-black transition"
                                    onClick={() => handleRemoveSkill(skillData.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Skill Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
                {filteredSuggestions.map((item) =>
                    <div
                        key={item.id}
                        className="flex justify-between items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:shadow-sm transition"
                        onClick={() => handleAddSkill(item.id)}
                    >
                        <span className="text-sm sm:text-base">
                            {item.name}
                        </span>
                        <button className="text-primary font-bold text-lg">
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Skills
