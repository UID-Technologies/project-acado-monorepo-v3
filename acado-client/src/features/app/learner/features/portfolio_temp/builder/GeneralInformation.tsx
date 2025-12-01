import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import { PiStudent } from 'react-icons/pi'
import { UserPortfolio } from '@app/types/learner/portfolio'
import {
    fetchPortfolioInfo,
    fetchUpdateImage,
} from '@services/learner/PortfolioEditInfoService'
import { usePortfolioBasicInfoStore } from '@app/store/learner/portfolioBasicInfoStore'
import { useImageUpdateStore } from '@app/store/learner/ImageUpdateStore'
import defaultProfile from '@/assets/images/defaultprofile.jpg'
import { useSnackbar } from "notistack";

type BuilderFormSchema = {
    name?: string | null
    lastName?: string | null
    email?: string | null
    phone?: string | null
    headline?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    about_me?: string | null
}

type GeneralInformationProps = {
    portfolio: UserPortfolio
}

const GeneralInformation = ({ portfolio }: GeneralInformationProps) => {
    const {
        setPortfolioBasicInfo,
        setError: setPortfolioError,
        setLoading: setPortfolioLoading,
    } = usePortfolioBasicInfoStore()
    const {
        setImageUpdate,
        setError: setImageUpdateError,
        setLoading: setImageUpdateLoading,
    } = useImageUpdateStore()
    const [editData, setEditData] = useState<BuilderFormSchema | null>(null)
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string>(
        portfolio?.image || defaultProfile,
    )
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    
    const validationSchema = z.object({
        name: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        headline: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        about_me: z.string().optional(),
    })

    const profile = Array.isArray(portfolio?.portfolio_profile)
    ? portfolio.portfolio_profile[0]
    : null;


    const defaultValues: Partial<BuilderFormSchema> = {
        name: portfolio?.name || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        headline: profile?.headline || '',
        city: profile?.city || '',
        state: profile?.state || '',
        country: profile?.country || '',
        about_me: profile?.about_me || '',
    }

    // Hook Form
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<BuilderFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues,
    })

    // Fetch updated info when editData changes
    useEffect(() => {
        const fetchPortfolioEditInfo = async () => {
            if (!editData) return

            setPortfolioLoading(true)
            try {
                const updated = await fetchPortfolioInfo(editData)
                setPortfolioBasicInfo(updated)
            } catch {
                setPortfolioError('Failed to load portfolio details.')
            } finally {
                setPortfolioLoading(false)
            }
        }

        fetchPortfolioEditInfo()
    }, [editData])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0]
            setUploadedImage(file)
            setImageUrl(URL.createObjectURL(file)) // 👈 show preview immediately
            setIsModalOpen(true)
        }
    }
    

    const handleDeleteImage = async () => {
        setImageUpdateLoading(true)

        try {
            // Fetch the default image as blob and convert to File
            const response = await fetch(defaultProfile)
            const blob = await response.blob()
            const defaultFile = new File([blob], 'default-avatar.jpg', {
                type: blob.type,
            })

            // Upload the default image as a way to "delete" the existing one
            const profileData = await fetchUpdateImage(defaultFile)
            setImageUpdate(profileData)
            setImageUrl(defaultProfile)
        } catch (error) {
            setImageUpdateError('Failed to delete profile image.')
        } finally {
            setImageUpdateLoading(false)
        }
    }

    const handleModalConfirm = async () => {
        if (!uploadedImage) return;
        setIsModalOpen(false);
        setImageUpdateLoading(true);
    
        try {
            const profileData = await fetchUpdateImage(uploadedImage);
            setImageUpdate(profileData);
            setImageUrl(URL.createObjectURL(file));
    
            // Fetch the latest portfolio data and store in localStorage
            const storedPortfolio = JSON.parse(localStorage.getItem('portfolioData') || '{}');
            const updatedPortfolio = { ...storedPortfolio, image: profileData?.image };
    
            localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolio));
    
        } catch {
            setImageUpdateError('Failed to update profile image.');
        } finally {
            setImageUpdateLoading(false);
        }
    };
    

    const handleModalCancel = () => {
        setUploadedImage(null)
        setImageUrl(portfolio?.image || `https://ui-avatars.com/api/?name=acado+ai`) // 👈 revert back
        setIsModalOpen(false)
    }
    
    const onSubmitData = async (data: BuilderFormSchema) => {
        const cleanData: BuilderFormSchema = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value?.trim() || null])
        );
    
        setPortfolioLoading(true);
    
        try {
            // Call the API to update user info
            const updatedPortfolio = await fetchPortfolioInfo(cleanData);
    
            // Update the store with the new data
            setPortfolioBasicInfo(updatedPortfolio);
            enqueueSnackbar("Profile updated successfully", { variant: "success" });
    
            // Store updated portfolio in localStorage
            localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolio));
    
        } catch (error) {
            setPortfolioError('Failed to update portfolio details.');
        } finally {
            setPortfolioLoading(false);
        }
    };
    

    return (
        <div className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-5 mb-[3.4rem]">
            <div className="flex items-center gap-3 border-b pb-3 border-primary">
                <PiStudent className="text-3xl text-primary" />
                <span className="text-xl text-primary">
                    General Information
                </span>
            </div>

            {/* Profile Image Section */}
            <div className="flex items-center gap-5 mt-6">
                <div className="relative w-20 h-20 group">
                    <div className="w-full h-full bg-slate-300 rounded-full border border-primary overflow-hidden">
                        <img
                            src={imageUrl}
                            alt="avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <button
                        onClick={handleDeleteImage}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Delete
                    </button>
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="avatar"
                        className="text-ac-dark bg-primary hover:bg-primary-mild px-4 py-2 rounded cursor-pointer"
                    >
                        Upload Image
                    </label>
                    <input
                        type="file"
                        id="avatar"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <span className="block mt-3 text-slate-400 text-xs">
                        Max size 2mb. Formats: JPG, PNG.
                    </span>
                </div>
            </div>

            {/* Form Section */}
            <Form onSubmit={handleSubmit(onSubmitData)}>
                <div className="grid md:grid-cols-2 gap-4 mt-10">
                    {(
                        [
                            { name: 'name', label: 'First Name' },
                            { name: 'lastName', label: 'Last Name' },
                            { name: 'email', label: 'Email Address' },
                            { name: 'phone', label: 'Phone Number' },
                            { name: 'headline', label: 'Address' },
                            { name: 'city', label: 'City' },
                            { name: 'state', label: 'State' },
                            { name: 'country', label: 'Country' },
                        ] as const
                    ).map((field) => (
                        <FormItem
                            key={field.name}
                            label={field.label}
                            className="mb-0 md:mb-3"
                            invalid={Boolean(errors[field.name])}
                            errorMessage={errors[field.name]?.message}
                        >
                            <Controller
                                name={field.name}
                                control={control}
                                render={({ field: ctrlField }) => (
                                    <Input
                                        type="text"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                                        {...ctrlField}
                                    />
                                )}
                            />
                        </FormItem>
                    ))}
                    <div className="col-span-2">
                        <FormItem
                            label="About You"
                            className="mb-0 md:mb-3"
                            invalid={Boolean(errors.about_me)}
                            errorMessage={errors.about_me?.message}
                        >
                            <Controller
                                name="about_me"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        type="text"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Tell us about yourself"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="solid" className="mt-5 text-ac-dark">
                        Save Changes
                    </Button>
                </div>
            </Form>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="dark:bg-gray-700 bg-white rounded-lg p-6 w-[300px]">
                        <p className="mb-4 text-center">
                            Do you confirm the upload of this image?
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={handleModalCancel}>No</Button>
                            <Button
                                variant="solid"
                                onClick={handleModalConfirm}
                                className="text-ac-dark"
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GeneralInformation
