import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ZodType } from 'zod';
import { Input } from '@/components/ui/Input';
import { FormItem, Form } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { useForm, Controller } from 'react-hook-form';
// types
import { Activity, ExperienceActivity } from '@app/types/learner/portfolio';
import { addExperienceActivity, deleteActivity } from '@services/learner/Portfolio';
// icons
import { IdCard, Pencil, Trash } from 'lucide-react';
import { MdAdd } from 'react-icons/md';
import { useSnackbar } from "notistack";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

const JobTypeEnum = z.enum(['Full Time', 'Part Time', 'Contract', 'Internship']);

type EducationsProps = {
    experiences: Activity[]
}

const Experience = ({ experiences: initialExperiences }: EducationsProps) => {

    const { enqueueSnackbar } = useSnackbar();
    const [experiences, setExperience] = useState<Activity[]>(initialExperiences);
    const [showForm, setShowForm] = React.useState(false);

    const validationSchema: ZodType<ExperienceActivity> = z.object({
        title: z.string().nonempty('Title is required'),
        institute: z.string().nonempty('Company is required'),
        employment_type: JobTypeEnum.or(
            z.string().min(1).max(100).refine(
                (val) => !JobTypeEnum.options.includes(val as any),
                'Job type must be one of the predefined values or a related term.'
            )
        ),
        location: z.string().nonempty('Location is required'),
        start_date: z.string().nonempty('Start Date is required'),
        end_date: z.string().nonempty('End Date is required'),
        description: z.string().nonempty('Description is required'),
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<ExperienceActivity>({
        resolver: zodResolver(validationSchema),
    });

    const onSubmitData = (data: ExperienceActivity) => {
        const newExperience = { ...data, activity_type: 'Experience' };
        addExperienceActivity(newExperience).then((response) => {
            console.log(response);
            setExperience([...experiences, newExperience]);
            enqueueSnackbar("Experience added successfully", { variant: "success" });
            setShowForm(false);
            reset();
        }).catch((error) => {
            console.log(error);
            enqueueSnackbar(error, { variant: "error" });
        }).finally(() => {
            console.log('Done');
        });
    };

    const deleteExperience = (experienceId?: number) => {
        if (experienceId) {
            deleteActivity(experienceId).then(() => {
                setExperience((prevExperience) => prevExperience.filter((experience) => experience.id !== experienceId))
                enqueueSnackbar("Education deleted successfully", { variant: "success" });
            }).catch((error) => {
                enqueueSnackbar(error, { variant: "error" });
            }).finally(() => {
                console.log('Finally')
            });
        }
    }

    return (
        <div className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-5 mb-[3.4rem]">
            <div className='flex items-center gap-3 border-b pb-3 border-primary justify-between px-3'>
                <div className='flex items-center gap-2'>
                    <IdCard size={30} className='text-primary' />
                    <span className='text-xl text-primary'>Experience</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='text-primary dark:text-primary flex items-center gap-1' onClick={() => setShowForm(!showForm)}>
                        {!showForm && <MdAdd size={20} />} {showForm ? 'Show Data' : 'Add Experience'}
                    </button>
                </div>
            </div>
            {/* Data */}

            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
                    }`}>
                <Table>
                    <TableHead>
                        <TableRow isHeader>
                            <TableCell isHeader>Sr. no</TableCell>
                            <TableCell isHeader>Institute</TableCell>
                            <TableCell isHeader>Type</TableCell>
                            <TableCell isHeader>Start Year</TableCell>
                            <TableCell isHeader>End Year</TableCell>
                            <TableCell isHeader>Description</TableCell>
                            <TableCell isHeader>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {experiences.map((experience, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{experience.institute}</TableCell>
                                <TableCell>{experience.employment_type}</TableCell>
                                <TableCell>{experience.start_date}</TableCell>
                                <TableCell>{experience.end_date}</TableCell>
                                <TableCell>{experience.description}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        {/* <button className="text-primary dark:text-primary">
                                            <Pencil size={16} />
                                        </button> */}
                                        <button className="text-primary dark:text-primary" onClick={() => { deleteExperience(experience?.id) }}>
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {
                            experiences.length === 0 && (
                                <TableRow>
                                    <TableCell colspan={7} className="text-center">No Experiences added yet.</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            {/* Form */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden mt-5 ${showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <Form onSubmit={handleSubmit(onSubmitData)}>
                    <div className="grid md:grid-cols-6 gap-3 mt-3">
                        <div className="col-span-3">
                            <FormItem
                                label="Title"
                                className="mb-0"
                                invalid={Boolean(errors.title)}
                                errorMessage={errors.title?.message}
                            >
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="title"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Title"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Company"
                                className="mb-0"
                                invalid={Boolean(errors.institute)}
                                errorMessage={errors.institute?.message}
                            >
                                <Controller
                                    name="institute"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="institute"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Company"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Job Type"
                                className="mb-0"
                                invalid={Boolean(errors.employment_type)}
                                errorMessage={errors.employment_type?.message}
                            >
                                <Controller
                                    name="employment_type"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            id="employment_type"
                                            className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary border rounded block w-full py-1.5 px-3"
                                            {...field}
                                        >
                                            <option value="">Select Job Type</option>
                                            <option value="Full Time">Full Time</option>
                                            <option value="Part Time">Part Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Location"
                                className="mb-0"
                                invalid={Boolean(errors.location)}
                                errorMessage={errors.location?.message}
                            >
                                <Controller
                                    name="location"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="location"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Location"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Start Date"
                                className="mb-0"
                                invalid={Boolean(errors.start_date)}
                                errorMessage={errors.start_date?.message}
                            >
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="month"
                                            id="start_date"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Start Date"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="End Date"
                                className="mb-0"
                                invalid={Boolean(errors.end_date)}
                                errorMessage={errors.end_date?.message}
                            >
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="month"
                                            id="end_date"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter End Date"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-6">
                            <FormItem
                                label="Description"
                                className="mb-0"
                                invalid={Boolean(errors.description)}
                                errorMessage={errors.description?.message}
                            >
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="description"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Discription"
                                            {...field}
                                            textArea
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <Button variant="solid" className="mt-5 text-ac-dark">Add Experience</Button>
                    </div>
                </Form>
            </div>
        </div >
    );
};

export default Experience;
