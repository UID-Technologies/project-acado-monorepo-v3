import React, { useEffect, useState } from 'react'
import {
    SkillsResponseData,
    SkillsRequest,
} from '@app/types/learner/portfolio'
import { useSkillsSuggestionsStore } from '@app/store/learner/portfolioStore'
import {
    getSkillsSuggestions,
    getUserSkills,
    addUserSkill,
    deleteUserSkill,
} from '@services/learner/Portfolio'
import { Input } from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { useForm, Controller } from 'react-hook-form'
import { MdAdd } from 'react-icons/md'
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table'
import { Trash } from 'lucide-react'
import { useSnackbar } from 'notistack'

const Skill = () => {
    const { enqueueSnackbar } = useSnackbar()
    const {
        setSuggestions,
        suggestions,
        error: suggestionsError,
        setError: setSuggestionsError,
        loading: suggestionsLoading,
        setLoading: setSuggestionsLoading,
    } = useSkillsSuggestionsStore()

    const [showForm, setShowForm] = useState(false)
    const [skills, setSkills] = useState<SkillsResponseData[]>([])
    const [selfProficiencyLevel, setSelfProficiencyLevel] = useState(50)

    const {
        handleSubmit,
        control,
        reset,
    } = useForm<SkillsRequest>({
        defaultValues: {
            skill_id: undefined,
            self_proficiency: '50',
        },
    })

    const fetchSkillMappings = () => {
        getUserSkills()
            .then((data) => setSkills(data))
            .catch((err) => {
                console.log(err)
                enqueueSnackbar('Failed to fetch skills', { variant: 'error' })
            })
    }

    const fetchSuggestions = () => {
        setSuggestionsLoading(true)
        setSuggestionsError('')
        getSkillsSuggestions()
            .then((data) => setSuggestions(data))
            .catch((error) => setSuggestionsError(error))
            .finally(() => setSuggestionsLoading(false))
    }

    useEffect(() => {
        fetchSuggestions()
        fetchSkillMappings()
    }, [])

    const onSubmitData = (data: SkillsRequest) => {
        addUserSkill(data)
            .then(() => {
                enqueueSnackbar('Skill added successfully', {
                    variant: 'success',
                })
                fetchSkillMappings()
                setShowForm(false)
                reset()
                setSelfProficiencyLevel(50)
            })
            .catch((error) => {
                console.log(error)
                enqueueSnackbar('Failed to add skill', { variant: 'error' })
            })
    }

    const handleDelete = (mappingId: number) => {
        if (!mappingId) {
            enqueueSnackbar('Skill mapping ID is required', {
                variant: 'error',
            })
            return
        }

        deleteUserSkill(mappingId)
            .then(() => {
                enqueueSnackbar('Skill deleted successfully', {
                    variant: 'success',
                })
                fetchSkillMappings()
            })
            .catch((error) => {
                console.log(error)
                enqueueSnackbar('Failed to delete skill', { variant: 'error' })
            })
    }

    return (
        <div className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-5 mb-[3.4rem]">
            <div className="flex items-center gap-3 border-b pb-3 border-primary justify-between px-3">
                <span className="text-xl text-primary">Skills</span>
                <button
                    className="text-primary flex items-center gap-1"
                    onClick={() => setShowForm(!showForm)}
                >
                    {!showForm && <MdAdd size={20} />} {showForm ? 'Show Data' : 'Add Skill'}
                </button>
            </div>

            {/* Skill Table */}
            <div className={`transition-all duration-500 ${showForm ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'} overflow-hidden`}>
                <Table>
                    <TableHead>
                        <TableRow isHeader>
                            <TableCell isHeader>Sr. no</TableCell>
                            <TableCell isHeader>Skill</TableCell>
                            <TableCell isHeader>Level</TableCell>
                            <TableCell isHeader>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {skills.length > 0 ? (
                            skills.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.self_proficiency}</TableCell>
                                    <TableCell>
                                        <button
                                            className="text-primary"
                                            onClick={() => item.id !== undefined && handleDelete(item.id)}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colspan={4} className="text-center">
                                    No skills added yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add Skill Form */}
            <div className={`transition-all duration-500 mt-5 ${showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <Form onSubmit={handleSubmit(onSubmitData)}>
                    <div className="grid grid-cols-1 gap-4 mt-3">
                        <FormItem label="Skill">
                            <Controller
                                name="skill_id"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        className="input input-md h-12 w-full border rounded"
                                        {...field}
                                    >
                                        <option value="">Select Skill</option>
                                        {suggestions.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </FormItem>

                        <FormItem label="Self Proficiency">
                            <Controller
                                name="self_proficiency"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            className="w-full"
                                            min={0}
                                            max={100}
                                            step={1}
                                            {...field}
                                            onChange={(e) => {
                                                setSelfProficiencyLevel(Number(e.target.value))
                                                field.onChange(e.target.value)
                                            }}
                                        />
                                        <span>{selfProficiencyLevel}%</span>
                                    </div>
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="flex justify-end mt-5">
                        <Button type="submit" variant="solid" className="text-ac-dark">
                            Add Skill
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Skill
