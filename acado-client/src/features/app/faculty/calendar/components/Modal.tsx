import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import { RxCross1 } from 'react-icons/rx'
import { fetchMentorList } from '@services/learner/MentorListService'
import { useMentorStore } from '@app/store/learner/MentorListStore'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    defaultValues?: {
        start: Date
        end: Date
        title: string
        description?: string
        link?: string
    }
    onSave: (data: Event) => void
    onDelete?: () => void
}

interface Event {
    id?: string
    title: string
    start: Date
    end: Date
    description?: string
    invited_user_ids?: number[] // Array of mentor IDs
    link?: string
}

const validationSchema = z.object({
    title: z.string().nonempty('Please enter a title.'),
    start: z.date(),
    end: z.date(),
    description: z.string().optional(),
    mentor: z.array(z.string()).optional(), // Ensuring mentor is an array of strings
    link: z.string().optional(),
})

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSave,
    defaultValues,
    onDelete,
}) => {
    const { mentor, setMentor, error, setError, isLoading, setIsLoading } =
        useMentorStore()

    const [selectedMentors, setSelectedMentors] = useState<
        { value: string; label: string }[]
    >([])

    useEffect(() => {
        setError('')
        setIsLoading(true)
        fetchMentorList()
            .then((response) => {
                if (response.status === 1) {
                    setMentor(response)
                } else {
                    throw new Error('Failed to fetch mentors')
                }
            })
            .catch((error) => {
                setError(error.message || 'Error fetching mentors')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [setMentor, setError, setIsLoading])

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Event>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            title: defaultValues?.title || '',
            start: defaultValues?.start || new Date(),
            end: defaultValues?.end || new Date(),
            description: defaultValues?.description || '',
            mentor: defaultValues?.mentor || [],
            link: defaultValues?.link || '',
        },
    })

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const handleSelectMentor = (id: string, name: string) => {
        if (!selectedMentors.find((m) => m.value === id)) {
            const newMentors = [...selectedMentors, { value: id, label: name }]
            setSelectedMentors(newMentors)
        }
    }

    const handleRemoveMentor = (id: string) => {
        setSelectedMentors(selectedMentors.filter((m) => m.value !== id))
    }

    const onSubmit = async (data: Event) => {
        try {
            const formatDateTime = (date: Date | null) =>
                date
                    ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                          .toISOString()
                          .slice(0, 16) // Convert to "YYYY-MM-DDTHH:MM"
                    : null;
    
            const formattedData = {
                ...data,
                start: formatDateTime(data.start),
                end: formatDateTime(data.end),
                start_date: formatDateTime(data.start_date),
                end_date: formatDateTime(data.end_date),
                invited_user_ids: selectedMentors.map((m) => Number(m.value)), // Convert IDs to numbers
            };
    
            onSave(formattedData);
            onClose();
        } catch (error) {
            console.error('Error saving event', error);
        }
    };
    

    if (!isOpen) return null

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm px-2 sm:px-4">
            <div className="relative bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-2xl max-h-[95vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-primary text-xl"
                >
                    <RxCross1 />
                </button>

                <Form className="gap-1" onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Event Title"
                        className="mb-3"
                        invalid={!!errors.title}
                        errorMessage={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter event title"
                                />
                            )}
                        />
                    </FormItem>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                        <FormItem
                            label="Start Date & Time"
                            invalid={!!errors.start}
                            errorMessage={errors.start?.message}
                        >
                            <Controller
                                name="start"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={
                                            field.value
                                                ? new Date(
                                                      field.value.getTime() -
                                                          field.value.getTimezoneOffset() *
                                                              60000,
                                                  )
                                                      .toISOString()
                                                      .slice(0, 16)
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.onChange(
                                                new Date(
                                                    e.target.value.replace(
                                                        ' ',
                                                        'T',
                                                    ),
                                                ),
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="End Date & Time"
                            invalid={!!errors.end}
                            errorMessage={errors.end?.message}
                        >
                            <Controller
                                name="end"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={
                                            field.value
                                                ? new Date(
                                                      field.value.getTime() -
                                                          field.value.getTimezoneOffset() *
                                                              60000,
                                                  )
                                                      .toISOString()
                                                      .slice(0, 16)
                                                : ''
                                        }
                                        onChange={(e) =>
                                            field.onChange(
                                                new Date(e.target.value),
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <FormItem
                        label="Description"
                        className="mb-3"
                        invalid={!!errors.description}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    {...field}
                                    placeholder="Enter description (optional)"
                                />
                            )}
                        />
                    </FormItem>

                    {/* Selected Mentors */}
                    <div className="flex flex-wrap mb-3">
                        {selectedMentors.map((mentor) => (
                            <div
                                key={mentor.value}
                                className="border-2 border-primary text-white px-3 py-1 rounded-full flex items-center gap-2 m-1"
                            >
                                {mentor.label}
                                <button
                                    onClick={() =>
                                        handleRemoveMentor(mentor.value)
                                    }
                                    className="text-white rounded-full"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormItem
                            label="Select Mentor"
                            invalid={!!errors.mentor}
                        >
                            <Controller
                                name="mentor"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(id) => {
                                            const mentorObj = mentor?.data.find(
                                                (m) => m.id.toString() === id,
                                            )
                                            if (mentorObj) {
                                                handleSelectMentor(
                                                    mentorObj.id.toString(),
                                                    mentorObj.name,
                                                )
                                            }
                                            field.onChange([
                                                ...selectedMentors.map(
                                                    (m) => m.value,
                                                ),
                                                id,
                                            ])
                                        }}
                                    >
                                        <SelectTrigger className="dark:bg-gray-700 text-white border py-6 border-gray-600 rounded-xl dark:hover:bg-gray-800">
                                            <SelectValue placeholder="Select Mentor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mentor?.data
                                                ?.filter(
                                                    (m) =>
                                                        !selectedMentors.some(
                                                            (s) =>
                                                                s.value ===
                                                                m.id.toString(),
                                                        ),
                                                )
                                                .map((m) => (
                                                    <SelectItem
                                                        key={m.id}
                                                        value={m.id.toString()}
                                                    >
                                                        {m.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Meeting Link"
                            invalid={!!errors.link}
                            errorMessage={errors.link?.message}
                        >
                            <Controller
                                name="link"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter meeting link (optional)"
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <Button
                        variant="solid"
                        className="text-ac-dark mt-4"
                        type="submit"
                        block
                        loading={isSubmitting}
                    >
                        Save Event
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default Modal
