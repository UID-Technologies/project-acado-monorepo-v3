import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodType } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { MdAdd } from 'react-icons/md'
import { Trash } from 'lucide-react'
import { useSnackbar } from 'notistack'
import { Activity, ProjectActivity } from '@app/types/learner/portfolio'
import { addProject, deleteActivity } from '@services/learner/Portfolio'

type ProjectProps = {
    projects: Activity[]
}

const ProjectTab = ({ projects: initialProjects }: ProjectProps) => {
    const { enqueueSnackbar } = useSnackbar()
    const [projects, setProjects] = useState<Activity[]>(initialProjects)

    const [showForm, setShowForm] = useState(false)

    const schema: ZodType<ProjectActivity> = z.object({
        title: z.string().nonempty('Title is required'),
        institute: z.string().nonempty('Institute is required'),
        start_date: z.string().nonempty('Start date is required'),
        end_date: z.string().optional(),
        action: z.string().url('Project link must be a valid URL'),
        certificate: z
            .instanceof(File)
            .refine((file) => file.size > 0, { message: 'File is required' }),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<ProjectActivity>({
        resolver: zodResolver(schema),
    })

    const onSubmit = (data: ProjectActivity) => {
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('institute', data.institute)
        formData.append('start_date', data.start_date)
        formData.append('end_date', data.end_date || '')
        formData.append('action', data.action)
        formData.append('certificate', data.certificate)
        formData.append('activity_type', 'Project')

        addProject(formData)
            .then(() => {
                enqueueSnackbar('Project added successfully', {
                    variant: 'success',
                })
                setShowForm(false)
                reset()
                setProjects((prev) => [
                    ...prev,
                    {
                        ...data,
                        activity_type: 'Project',
                        image_name: data.certificate.name,
                        certificate: data.certificate.name,
                    },
                ])
            })
            .catch((err) => {
                console.error(err)
                enqueueSnackbar('Failed to add project', { variant: 'error' })
            })
    }

    const handleDelete = (projectId?: number) => {
        if (!projectId) return
        deleteActivity(projectId)
            .then(() => {
                setProjects((prev) => prev.filter((p) => p.id !== projectId))
                enqueueSnackbar('Project deleted successfully', {
                    variant: 'success',
                })
            })
            .catch((err) => {
                console.error(err)
                enqueueSnackbar('Failed to delete project', {
                    variant: 'error',
                })
            })
    }

    return (
        <div className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-5 mb-12">
            <div className="flex items-center justify-between border-b pb-3 border-primary px-3">
                <div className="text-xl text-primary">Projects</div>
                <button
                    className="text-primary flex items-center gap-1"
                    onClick={() => setShowForm(!showForm)}
                >
                    {!showForm && <MdAdd size={20} />}
                    {showForm ? 'Show Data' : 'Add Project'}
                </button>
            </div>

            {/* Projects list */}
            <div
                className={`transition-all duration-500 mt-5 ${!showForm ? 'block' : 'hidden'}`}
            >
                {projects &&
                    projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 border dark:bg-gray-900 shadow-md rounded-lg flex ps-2 relative mb-3"
                        >
                            {/* Placeholder image or project thumbnail if available */}
                            <img
                                className="img-thumbnail w-28"
                                src={`https://elms.edulystventures.com/portfolio/${project.image_name}`}
                            />

                            <div className="flex items-center gap-3 p-3">
                                <div>
                                    <h6 className="font-semibold text-primary dark:text-primary capitalize">
                                        {project.title}
                                    </h6>
                                    <p className="text-sm dark:text-gray-200 capitalize">
                                        {project.institute}
                                    </p>
                                    <p className="text-sm dark:text-gray-200">
                                        Start: {project.start_date}
                                    </p>
                                    {project.end_date && (
                                        <p className="text-sm dark:text-gray-200">
                                            End: {project.end_date}
                                        </p>
                                    )}
                                    {project.action && (
                                        <p className="text-sm">
                                            <a
                                                href={project.action}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 dark:text-blue-400 underline"
                                            >
                                                Project Link
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="absolute right-4 top-4">
                                <button
                                    className="text-primary dark:text-primary"
                                    onClick={() => handleDelete(project?.id)}
                                >
                                    <Trash size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Add project form */}
            <div
                className={`transition-all duration-500 ease-in-out mt-5 ${showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-6 gap-3">
                        <div className="col-span-3">
                            <FormItem
                                label="Title"
                                className="col-span-3"
                                invalid={!!errors.title}
                                errorMessage={errors.title?.message}
                            >
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <Input type="text" {...field} />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Institute"
                                className="col-span-3"
                                invalid={!!errors.institute}
                                errorMessage={errors.institute?.message}
                            >
                                <Controller
                                    name="institute"
                                    control={control}
                                    render={({ field }) => (
                                        <Input type="text" {...field} />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Start Date"
                                className="col-span-3"
                                invalid={!!errors.start_date}
                                errorMessage={errors.start_date?.message}
                            >
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input type="month" {...field} />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="End Date"
                                className="col-span-3"
                                invalid={!!errors.end_date}
                                errorMessage={errors.end_date?.message}
                            >
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input type="month" {...field} />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Project Link"
                                className="col-span-6"
                                invalid={!!errors.action}
                                errorMessage={errors.action?.message}
                            >
                                <Controller
                                    name="action"
                                    control={control}
                                    render={({ field }) => (
                                        <Input type="url" {...field} />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Upload Project File"
                                className="col-span-6"
                                invalid={!!errors.certificate}
                                errorMessage={errors.certificate?.message}
                            >
                                <Controller
                                    name="certificate"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.files?.[0],
                                                )
                                            }
                                            ref={field.ref}
                                            className="border rounded w-full py-1.5 px-3"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button type="submit">Add Project</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default ProjectTab
