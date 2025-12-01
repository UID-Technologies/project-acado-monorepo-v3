import React, { useRef } from 'react'
import { FormItem } from '@/components/ui/Form'
import { useSessionUser } from '@app/store/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { ZodType } from 'zod'
import { z } from 'zod'
import profileService from '@services/learner/profile'
import ActionLink from '@/components/shared/ActionLink'
import { useSnackbar } from 'notistack'
import profileStore from '@app/store/learner/profile'
import UserIcon from '@/assets/images/user.png'
import { Input } from '@/components/ui/shadcn/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/shadcn/button'

type CompleteProfileScheme = {
    name: string
    avatar?: string
    country: string
    mobile: string
    email: string
    highestQualification: string
}

const validationSchema: ZodType<CompleteProfileScheme> = z.object({
    name: z.string().min(2),
    country: z.string().min(2),
    mobile: z.string().min(10).max(15),
    email: z.string().email(),
    highestQualification: z.string().min(2),
})

const CompleteProfile = () => {
    const { enqueueSnackbar } = useSnackbar()
    const [newAvatar, setAvatar] = React.useState<string>('')
    const { email, name } = useSessionUser((state) => state.user)
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { portfolio } = profileStore.porfileStore()

    const {
        handleSubmit,
        formState: { errors },
        control,
        register,
    } = useForm<CompleteProfileScheme>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: name || '',
            country: portfolio?.country || '',
            mobile: '',
            email: email || '',
            highestQualification: '',
        },
    })

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setAvatar(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (values: CompleteProfileScheme) => {
        try {
            const response = await profileService.addProfile(values)
            if (response.status) {
                enqueueSnackbar(response?.data?.list, { variant: 'success' })
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <div className='flex justify-center flex-col min-h-screen pt-10 pb-10'>
            <div className="w-full px-4 sm:px-6 lg:w-1/2 mx-auto flex items-center justify-center dark:bg-gray-900 bg-white rounded-lg">
                <div className="w-full rounded-lg dark:bg-gray-900 bg-white p-4 sm:p-6 md:p-8">
                    <div className="text-center flex flex-col items-center">
                        <h2 className="mt-2 text-lg font-semibold text-gray-700">
                            Hello, {name || email}!
                        </h2>
                        <h4 className="mt-1 text-gray-700">Welcome to Acado</h4>
                    </div>
                    {/* Profile Image */}
                    <div className="mt-6 flex items-center justify-center border-b pb-5 mb-5">
                        <div
                            className="relative h-16 w-16 rounded-full border-2 border-gray-300"
                            style={{
                                backgroundImage: `url(${newAvatar ? newAvatar : UserIcon})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <button
                                className="absolute bottom-[-4px] right-[-8px] flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white"
                                onClick={handleAvatarClick}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                        <div className='space-y-1'>
                            <Label htmlFor="name" className="mb-2 font-medium">Name</Label>
                            <Input type="text" placeholder="Name" autoComplete="off" {...register('name')} />
                            <InputError message={errors.name?.message} />
                        </div>
                        {/* Mobile and Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
                            <div className='space-y-1'>
                                <Label htmlFor="mobile" className="mb-2 font-medium">Mobile</Label>
                                <Input type="text" placeholder="Mobile" autoComplete="off" {...register('mobile')} />
                                <InputError message={errors.mobile?.message} />
                            </div>
                            <div className='space-y-1'>
                                <Label htmlFor="email" className="mb-2 font-medium">Email</Label>
                                <Input type="email" placeholder="Email" autoComplete="off" {...register('email')} />
                                <InputError message={errors.email?.message} />
                            </div>
                        </div>

                        {/* Address and Country */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
                            <div className='space-y-1'>
                                <Label htmlFor="country" className="mb-2 font-medium">Country</Label>
                                <Input type="text" placeholder="Country" autoComplete="off" {...register('country')} />
                                <InputError message={errors.country?.message} />
                            </div>
                            <div className='space-y-1'>
                                <Label htmlFor="highestQualification" className="mb-2 font-medium">Highest Qualification</Label>
                                <Input type="text" placeholder="Highest Qualification" autoComplete="off" {...register('highestQualification')} />
                                <InputError message={errors.highestQualification?.message} />
                            </div>
                        </div>

                        {/* Avatar Upload (Hidden) */}
                        <div className="hidden">
                            <FormItem label="Avatar">
                                <Controller
                                    name="avatar"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="file"
                                            {...field}
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button
                                className="dark:text-ac-dark text-ac-dark mt-10"
                                type="submit"
                            >
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="flex justify-center w-full mt-2 mb-2  space-x-1">
                <p>Having trouble logging in?</p>
                <ActionLink
                    href="mailto:dpa@mailinator.com"
                    target="_blank"
                    className="font-bold text-primary"
                >
                    Contact Support
                </ActionLink>
            </div>
            <div className="flex justify-center space-x-4">
                <ActionLink
                    href="https://acado.ai/privacy-policy"
                    target="_blank"
                    className="font-bold text-primary "
                >
                    Terms & Conditions
                </ActionLink>
                <ActionLink
                    href="https://acado.ai/privacy-policy"
                    target="_blank"
                    className="font-bold text-primary underline"
                >
                    Privacy Policy
                </ActionLink>
            </div>
        </div>
    )
}

export default CompleteProfile
