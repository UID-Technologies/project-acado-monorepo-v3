import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ZodType } from 'zod'
// form components
import { Input } from '@/components/ui/Input';
import { useForm, Controller } from 'react-hook-form';
import { FormItem, Form } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
// api services
import { addEducationActivity, deleteActivity } from '@services/learner/Portfolio';
// types
import { Activity, EducationActivity } from '@app/types/learner/portfolio';
// table components
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
// icons
import { Pencil, Trash } from 'lucide-react';
import { MdAdd } from 'react-icons/md';
import { FaGraduationCap } from "react-icons/fa";
import { useSnackbar } from "notistack";


type EducationsProps = {
    educations: Activity[]
}

const Education = ({ educations: initialEducations }: EducationsProps) => {

    const { enqueueSnackbar } = useSnackbar();


    const [educations, setEducations] = useState<Activity[]>(initialEducations);
    const [showForm, setShowForm] = React.useState(false);

    const validationSchema: ZodType<EducationActivity> = z
        .object({
            institute: z.string().nonempty('Institute is required'),
            degree: z.string().nonempty('Degree is required'),
            study_field: z.string().nonempty('Field of study is required'),
            start_date: z.string().nonempty('Start year is required'),
            end_date: z.string().nonempty('End year is required'),
            description: z.string().nonempty('Description is required'),
            grade: z.string().nonempty('Grade is required'),
            location: z.string().nonempty('Location is required'),
        })

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<EducationActivity>({
        resolver: zodResolver(validationSchema),
    })

    const onSubmitData = (data: EducationActivity) => {
        const newEducation = { ...data, activity_type: 'Education', title: data.degree + ' in ' + data.study_field };
        addEducationActivity(newEducation)
            .then(() => {
                setEducations((prevEducations) => [...prevEducations, newEducation]);
                setShowForm(false);
                reset();
                enqueueSnackbar("Education added successfully", { variant: "success" });
            })
            .catch((error) => {
                enqueueSnackbar(error, { variant: "error" });
            }).finally(() => {
                console.log('Finally')
            })
    }

    const deleteEducation = (educationId?: number) => {
        if (educationId) {
            deleteActivity(educationId).then(() => {
                setEducations((prevEducations) => prevEducations.filter((education) => education.id !== educationId))
                enqueueSnackbar("Education deleted successfully", { variant: "success" });
            }).catch((error) => {
                enqueueSnackbar(error, { variant: "error" });
            }).finally(() => {
                console.log('Finally')
            });
        }
    }

    return (
        <div className='shadow-md bg-white dark:bg-gray-800 rounded-lg p-5 mb-[3.4rem]'>
            <div className='flex items-center gap-3 border-b pb-3 border-primary justify-between px-3'>
                <div className='flex items-center gap-2'>
                    <FaGraduationCap className='text-3xl text-primary' />
                    <span className='text-xl text-primary'>Education</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='text-primary dark:text-primary flex items-center gap-1' onClick={() => setShowForm(!showForm)}>
                        {!showForm && <MdAdd size={20} />} {showForm ? 'Show Data' : 'Add Education'}
                    </button>
                </div>
            </div>
            <div
                className={`transition-all duration-500 ease-in-out overflow-y-hidden ${showForm ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
                    }`}>
                <Table className='overflow-hidden'>
                    <TableHead>
                        <TableRow isHeader>
                            <TableCell isHeader>Sr. no</TableCell>
                            <TableCell isHeader>Institute</TableCell>
                            <TableCell isHeader>Start Year</TableCell>
                            <TableCell isHeader>End Year</TableCell>
                            <TableCell isHeader>Field Of Study</TableCell>
                            <TableCell isHeader>Grade</TableCell>
                            <TableCell isHeader>Location</TableCell>
                            <TableCell isHeader>Description</TableCell>
                            <TableCell isHeader>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {educations.map((education, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{education.institute}</TableCell>
                                <TableCell>{education.start_date}</TableCell>
                                <TableCell>{education.end_date}</TableCell>
                                <TableCell>{education.study_field}</TableCell>
                                <TableCell>{education.grade}</TableCell>
                                <TableCell>{education.location}</TableCell>
                                <TableCell>{education.description}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        {/* <button className="text-primary dark:text-primary">
                                            <Pencil size={16} />
                                        </button> */}
                                        <button className="text-primary dark:text-primary" onClick={() => { deleteEducation(education?.id) }}>
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {
                            educations.length === 0 && (
                                <TableRow>
                                    <TableCell colspan={8} className="text-center">No Education details added yet.</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            {/* div show and hide with animation tailwind */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden mt-5 ${showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <Form onSubmit={handleSubmit(onSubmitData)}>
                    <div className='grid md:grid-cols-6 gap-3 mt-3'>
                        <div className='col-span-6'>
                            <FormItem label="University / College and School Name" className='mb-0' invalid={Boolean(errors.institute)}
                                errorMessage={errors.institute?.message}
                            >
                                <Controller
                                    name="institute"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="institute"
                                            className='border rounded block w-full py-1.5 px-3'
                                            placeholder="Enter Your University / College and School Name"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className='col-span-6 md:col-span-2'>
                            <FormItem label="Degree" className='mb-0' invalid={Boolean(errors.degree)}
                                errorMessage={errors.degree?.message}
                            >
                                <Controller
                                    name="degree"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="degree"
                                            className='border rounded block w-full py-1.5 px-3'
                                            placeholder="Ex: Bachelor's"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className='col-span-6 md:col-span-2'>
                            <FormItem label="Field of Study" className='mb-0' invalid={Boolean(errors.study_field)}
                                errorMessage={errors.study_field?.message}
                            >
                                <Controller
                                    name="study_field"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="study_field"
                                            className='border rounded block w-full py-1.5 px-3'
                                            placeholder="Ex: Computer Science"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className='col-span-6 md:col-span-2'>
                            <FormItem label="Start Year" className='mb-0' invalid={Boolean(errors.start_date)}
                                errorMessage={errors.start_date?.message}
                            >
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="month"
                                            id="start_date"
                                            className='border rounded block w-full py-1.5 px-3'
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className='col-span-6 md:col-span-2'>
                            <FormItem label="End Year" className='mb-0' invalid={Boolean(errors.end_date)}
                                errorMessage={errors.end_date?.message}
                            >
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="month"
                                            id="end_date"
                                            className='border rounded block w-full py-1.5 px-3'
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className='col-span-6 md:col-span-2'>
                            <FormItem label="Grade" className='mb-0' invalid={Boolean(errors.grade)}
                                errorMessage={errors.grade?.message}
                            >
                                <Controller
                                    name="grade"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="grade"
                                            className='border rounded block w-full py-1.5 px-3'
                                            placeholder="Enter Your Grade"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className='col-span-6 md:col-span-2'>
                            <FormItem label="Location" className='mb-0' invalid={Boolean(errors.location)}
                                errorMessage={errors.location?.message}
                            >
                                <Controller
                                    name="location"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="location"
                                            className='border rounded block w-full py-1.5 px-3'
                                            placeholder="Enter Your Location"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className='col-span-6'>
                            <FormItem label="Description" className='mb-0' invalid={Boolean(errors.description)}
                                errorMessage={errors.description?.message}
                            >
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            textArea
                                            type="text"
                                            id="description"
                                            className='border rounded block w-full py-1.5 px-3'
                                            placeholder="Enter Your Description"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <Button variant="solid" className="mt-5 text-ac-dark">Save Education</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Education
