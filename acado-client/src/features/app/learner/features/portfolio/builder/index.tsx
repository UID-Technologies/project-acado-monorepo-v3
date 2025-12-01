import React, { memo, useCallback, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonalInfo from './PersonalInfo'
import Education from './Education'
import { Button } from '@/components/ui/ShadcnButton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { usePortfolioStore } from '@app/store/learner/portfolioStore';
import { userPortfolio, fetchUpdateImage, deleteActivity, deleteUserSkill } from '@services/learner/PortfolioService';
import Experience from './Experience';
import Certificate from './Certificate';
import Project from './Project';
import Skill from './Skill';
import { Badge } from '@/components/ui/badge';
import { getFileType } from "@/utils/getFileType";
import { useAuth } from '@app/providers/auth';
import deafultprofile from '@/assets/images/defaultprofile.jpg';
import { useSessionUser } from '@app/store/authStore';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/shadcnTooltip"
import { Dribbble, Expand, Eye, Globe, Instagram, Link2, Phone, Trash, X } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Link } from 'react-router-dom';
import SocialMedia from './SocialMedia';
import AddResume from './AddResume';

const PortfolioBuilder: React.FC = () => {

    const { user } = useAuth()

    const [showEducationDialog, setShowEducationDialog] = useState<boolean>(false);
    const [showExperienceDialog, setShowExperienceDialog] = useState<boolean>(false);
    const [showCertificateDialog, setShowCertificateDialog] = useState<boolean>(false);
    const [showSkillDialog, setShowSkillDialog] = useState<boolean>(false);
    const [showProjectDialog, setShowProjectDialog] = useState<boolean>(false);
    const [showSocialMediaDialog, setShowSocialMediaDialog] = useState<boolean>(false);
    const [showPersonalInfoDialog, setShowPersonalInfoDialog] = useState<boolean>(false);
    const { setPortfolio, portfolio, error, setError, loading, setLoading } = usePortfolioStore();
    const [tab, setTab] = useState<string>('personal');
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [addResumeDialog, setAddResumeDialog] = useState<boolean>(false);

    const fetchUserPortfolio = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await userPortfolio();
            setPortfolio(data);
            console.log(data);
        } catch (error) {
            setError("Failed to fetch portfolio");
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [setLoading, setPortfolio, setError]);

    useEffect(() => {
        fetchUserPortfolio();
    }, [fetchUserPortfolio]);


    const deleteActivityHandler = useCallback(async (id?: number) => {
        if (!id) {
            toast.error('Something went wrong, please try again');
            return;
        }
        setLoading(true);
        setError("");
        try {
            await deleteActivity(id);
            fetchUserPortfolio();
        } catch (error) {
            setError("Failed to delete activity");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fetchUserPortfolio, setLoading, setError]);

    const removeUserSkill = useCallback(async (id?: number) => {
        if (!id) {
            toast.error('Something went wrong, please try again');
            return;
        }
        setLoading(true);
        setError("");
        try {
            await deleteUserSkill(id);
            fetchUserPortfolio();
            toast.success('Skill removed successfully');
        } catch (error) {
            setError("Failed to delete skill");
            toast.error('Failed to delete skill');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fetchUserPortfolio, setLoading, setError]);

    interface Certificate {
        image_name: string;
    }

    const handleViewCertificate = (certificate: Certificate) => {
        // Add open cirfication in new tab
        const fileType = getFileType(certificate?.image_name);
        if (fileType === 'pdf') {
            window.open(certificate?.image_name, '_blank');

        } 
        else {
            const fileUrl = `https://elms.edulystventures.com/portfolio/${certificate?.image_name}`;
            const newWindow = window.open(fileUrl, '_blank');
            if (newWindow) {
                newWindow.opener = null;
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {

            // check uploaded image is less than 2mb and is of type image
            if (e.target.files[0].size > 2097152) {
                toast.error('Image size should be less than 2mb');
                return;
            }

            if (e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/jpeg') {
                toast.error('Invalid image format, please upload image in PNG or JPG format');
                return;
            }

            const uploadedImage = e.target.files[0];
            const localUrl = URL.createObjectURL(uploadedImage);
            setProfileImageUrl(localUrl);
            fetchUpdateImage(uploadedImage).then((res) => {
                toast.success('Profile image updated successfully');
                useSessionUser.setState((state) => ({
                    user: {
                        ...state.user,
                        profile_image: res ?? localUrl,
                    },
                }));
            }).catch((error) => {
                console.error(error);
                toast.error('Failed to update profile image');
            });
        }
    };

    const handleDeleteImage = async () => {
        // convert to blob
        const response = await fetch(deafultprofile);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.png', { type: 'image/png' });
        const showProfileImage = URL.createObjectURL(file);
        setProfileImageUrl(showProfileImage);
        fetchUpdateImage(file).then(() => {
            toast.success('Profile image updated successfully');
        }).catch((error) => {
            console.error(error);
            toast.error('Failed to update profile image');
        });
    };

    if (loading) return <Loading loading={loading} />
    if (error) return <Alert title={error} type='danger' />

    return (
        <>
            <Tabs defaultValue="personal" value={tab} onValueChange={setTab}>
                <div className='flex justify-between gap-4'>
                    <div className='overflow-auto'>
                        <TabsList className='bg-white dark:bg-gray-900'>
                            <TabsTrigger value="personal">Personal Information</TabsTrigger>
                            <TabsTrigger value="socialmedia">Social Media</TabsTrigger>
                            <TabsTrigger value="education">Education</TabsTrigger>
                            <TabsTrigger value="experience">Experience</TabsTrigger>
                            <TabsTrigger value="certificate">Certificate</TabsTrigger>
                            <TabsTrigger value="project">Projects</TabsTrigger>
                            <TabsTrigger value="resume">Resumes</TabsTrigger>
                            <TabsTrigger value="skill">Skills</TabsTrigger>
                        </TabsList>
                    </div>
                    <Link to='/portfolio'>
                        <Button className='text-white dark:text-black hidden md:block'>Preview Portfolio</Button>
                        <Button variant="default" className='text-white md:hidden'>
                            <Eye size={20} />
                        </Button>
                    </Link>
                </div>
                <TabsContent value="personal">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Personal Info</h2>
                                <Button className='text-white dark:text-black' variant='default' onClick={() => setShowPersonalInfoDialog(true)}>Update</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-5 mt-6">
                                <div className="relative w-20 h-20 group">
                                    <div className="w-full h-full bg-slate-300 rounded-full border border-primary overflow-hidden">
                                        <img src={profileImageUrl ? profileImageUrl
                                            : portfolio.image ? portfolio.image : `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>

                                    {/* Delete Button - visible on hover */}
                                    <button
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={handleDeleteImage}
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="mt-5">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="avatar"
                                            className="text-ac-dark bg-primary text-white dark:text-black px-4 py-2 rounded cursor-pointer"
                                        >
                                            Upload Image
                                        </label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    <span className="block text-slate-400 text-xs">
                                        Max size 2mb. Formats: JPG, PNG.
                                    </span>
                                </div>
                            </div>
                            {portfolio?.portfolio_profile?.length !== 0 && <table className='w-full mt-3'>
                                <tbody className='divide-y'>
                                    <tr className='hover:bg-gray-100 dark:hover:bg-gray-900'>
                                        <td className='w-40 font-semibold p-3 text-gray-600'>Full Name</td>
                                        <td className='py-2'>{portfolio?.portfolio_profile[0].name} {portfolio?.portfolio_profile[0].lastName}</td>
                                    </tr>
                                    <tr className='hover:bg-gray-100 dark:hover:bg-gray-900'>
                                        <td className='w-40 font-semibold p-3 text-gray-600'>Email</td>
                                        <td className='py-2'>{portfolio?.portfolio_profile[0].email}</td>
                                    </tr>
                                    <tr className='hover:bg-gray-100 dark:hover:bg-gray-900'>
                                        <td className='w-40 font-semibold p-3 text-gray-600'>Phone Number</td>
                                        <td className='py-2'>{portfolio?.portfolio_profile[0].phone}</td>
                                    </tr>
                                    <tr className='hover:bg-gray-100 dark:hover:bg-gray-900'>
                                        <td className='w-40 font-semibold p-3 text-gray-600'>Address</td>
                                        <td className='py-2'>
                                            {portfolio?.portfolio_profile[0].city}, {portfolio?.portfolio_profile[0].state}, {portfolio?.portfolio_profile[0].country}
                                        </td>
                                    </tr>
                                    <tr className='hover:bg-gray-100 dark:hover:bg-gray-900'>
                                        <td className='w-40 font-semibold p-3 text-gray-600'>About</td>
                                        <td className='py-2'>{portfolio?.portfolio_profile[0].about_me}</td>
                                    </tr>
                                </tbody>
                            </table>
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="socialmedia">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Social Media</h2>
                                <Button className='text-white dark:text-black' variant='default' onClick={() => setShowSocialMediaDialog(true)}>Update</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {portfolio?.portfolio_social[0].linkedin && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://linkedin.com/favicon.ico" alt="linkedin"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>LinkedIn</h6>
                                        <p>{portfolio?.portfolio_social[0].linkedin}</p>
                                    </div>
                                </div>
                                }
                                {portfolio?.portfolio_social[0].facebook && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://facebook.com/favicon.ico" alt="facebook"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>Facebook</h6>
                                        <p>{portfolio?.portfolio_social[0].facebook}</p>
                                    </div>
                                </div>
                                }
                                {portfolio?.portfolio_social[0].twitter && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://twitter.com/favicon.ico" alt="twitter"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>Twitter</h6>
                                        <p>{portfolio?.portfolio_social[0].twitter}</p>
                                    </div>
                                </div>
                                }
                                {portfolio?.portfolio_social[0].insta && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <div className='w-12 h-12 object-contain rounded-lg flex justify-center items-center bg-gray-300'>
                                        <Instagram size={40} />
                                    </div>
                                    <div>
                                        <h6>Instagram</h6>
                                        <p>{portfolio?.portfolio_social[0].insta}</p>
                                    </div>
                                </div>
                                }
                                {/* gmail */}
                                {portfolio?.portfolio_social[0].email && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://www.google.com/a/cpanel/mbm.ac.in/images/favicon.ico" alt="gmail"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>Gmail</h6>
                                        <p>{portfolio?.portfolio_social[0].email}</p>
                                    </div>
                                </div>
                                }
                                {/* phone number */}
                                {portfolio?.portfolio_social[0].mob_num && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <div className='w-12 h-12 object-contain rounded-lg flex justify-center items-center bg-gray-300'>
                                        <Phone size={40} />
                                    </div>
                                    <div>
                                        <h6>Phone Number</h6>
                                        <p>{portfolio?.portfolio_social[0].mob_num}</p>
                                    </div>
                                </div>
                                }
                                {/* website */}
                                {portfolio?.portfolio_social[0].site_url && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <div className='w-12 h-12 object-contain rounded-lg flex justify-center items-center bg-gray-300'>
                                        <Globe size={40} />
                                    </div>
                                    <div>
                                        <h6>Website</h6>
                                        <p>{portfolio?.portfolio_social[0].site_url}</p>
                                    </div>
                                </div>
                                }
                                {/* Dribbble */}
                                {portfolio?.portfolio_social[0].dribble && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <div className='w-12 h-12 object-contain rounded-lg flex justify-center items-center bg-gray-300'>
                                        <Dribbble size={40} />
                                    </div>
                                    <div>
                                        <h6>Dribbble</h6>
                                        <p>{portfolio?.portfolio_social[0].dribble}</p>
                                    </div>
                                </div>
                                }
                                {/* pinterest */}
                                {portfolio?.portfolio_social[0].pinterest && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://www.pinterest.com/favicon.ico" alt="pinterest"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>Pinterest</h6>
                                        <p>{portfolio?.portfolio_social[0].pinterest}</p>
                                    </div>
                                </div>
                                }
                                {
                                    portfolio?.portfolio_social[0].linkedin === null &&
                                    portfolio?.portfolio_social[0].facebook === null &&
                                    portfolio?.portfolio_social[0].twitter === null &&
                                    portfolio?.portfolio_social[0].insta === null &&
                                    portfolio?.portfolio_social[0].email === null &&
                                    portfolio?.portfolio_social[0].mob_num === null &&
                                    portfolio?.portfolio_social[0].site_url === null &&
                                    portfolio?.portfolio_social[0].dribble === null &&
                                    portfolio?.portfolio_social[0].pinterest === null &&
                                    <p className='p-2'>No social media found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="education">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Education</h2>
                                <Button className='text-white dark:text-black' variant='default' onClick={() => setShowEducationDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {
                                    portfolio.Education.map((education, index) => (
                                        <Card key={index}>
                                            <CardHeader>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center'>
                                                        <img src={`https://ui-avatars.com/api/?name=${education.title}&background=random`} alt={education?.title} className='w-12 h-12 object-cover rounded-full' />
                                                        <div className='ml-3'>
                                                            <h6>{education.title}</h6>
                                                            <p>{education.institute}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant='destructive' onClick={() => deleteActivityHandler(education?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className='text-gray-400 mt-1'>{new Date(education.start_date || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {education.end_date ? new Date(education.end_date || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}</p>
                                                <p className='mt-2'>{education.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio.Education.length === 0 && <p>No education found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="experience">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Experience</h2>
                                <Button className='text-white dark:text-black' variant='default' onClick={() => setShowExperienceDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {
                                    portfolio.Experience.map((experience, index) => (
                                        <Card key={index}>
                                            <CardHeader>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center'>
                                                        <img src={`https://ui-avatars.com/api/?name=${experience.title}&background=random`} alt={experience.title} className='w-12 h-12 object-cover rounded-full' />
                                                        <div className='ml-3'>
                                                            <h6>{experience.title}</h6>
                                                            <p>{experience.institute}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant='destructive' onClick={() => deleteActivityHandler(experience?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className='text-gray-400 mt-1'>{new Date(experience.start_date || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {experience.end_date ? new Date(experience.end_date || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}</p>
                                                <p className='mt-2'>{experience.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio.Experience.length === 0 && <p>No experience found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="certificate">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Certificate</h2>
                                <Button className='text-white dark:text-black' variant='default' onClick={() => setShowCertificateDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4'>
                                {
                                    portfolio.Certificate.map((certificate, index) => (
                                        <Card key={index}>
                                            <CardHeader className='p-0 rounded-t-lg overflow-hidden relative'>
                                                {
                                                    certificate?.image_name && getFileType(certificate?.image_name) === 'pdf' && <embed src={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} className='border-none outline-none' />
                                                }
                                                {
                                                    certificate?.image_name && getFileType(certificate?.image_name) !== 'pdf' && <img src={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} alt={certificate.title} className='w-full h-40 object-cover' />
                                                }
                                                <div className='absolute -top-1 right-0 bg-black bg-opacity-0 p-2 w-full h-full flex justify-end'>
                                                    <div className='flex gap-2'>
                                                        <Button variant='destructive' onClick={() => deleteActivityHandler(certificate?.id)}>
                                                            <Trash />
                                                        </Button>
                                                        <Button onClick={() => handleViewCertificate({ ...certificate, image_name: certificate.image_name ?? '' })} variant='outline'>
                                                            <Expand />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className='p-2'>
                                                <h3 className='capitalize text-lg'>{certificate.title}</h3>
                                                <p>{certificate.institute}</p>
                                                <p className='text-gray-400 mt-1'>{new Date(certificate.start_date || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {certificate.end_date ? new Date(certificate.end_date || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio.Certificate.length === 0 && <p>No certificate found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="skill">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Skills</h2>
                                <Button className='text-white dark:text-black' variant='default' onClick={() => setShowSkillDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TooltipProvider>
                                {
                                    portfolio?.skill?.map((skill, index) => (
                                        <Tooltip key={index}>
                                            <TooltipTrigger>
                                                <Badge className='mr-2 mb-3 text-white dark:text-black'>{skill.name}
                                                    <span className='ml-2 text-xs text-white dark:text-black'>{skill.self_proficiency}</span>
                                                    <span className='ml-2 text-xs text-white dark:text-black' onClick={() => removeUserSkill(skill?.id)}>
                                                        <X size={20} />
                                                    </span>
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent className='w-[300px]'>
                                                <div>
                                                    <h6>{skill.name}</h6>
                                                    <p>{skill.description}</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))
                                }
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="project">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Projects</h2>
                                <Button className='text-white dark:text-black' variant='default' onClick={() => setShowProjectDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {
                                    portfolio?.Project && portfolio?.Project?.map((project, index) => (
                                        <Card key={index}>
                                            <CardHeader className='p-0 rounded-t-lg overflow-hidden'>
                                                <div className='bg-gray-100'>
                                                    {
                                                        project?.image_name && getFileType(project?.image_name) === 'pdf' && <embed src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} className='border-none outline-none' />
                                                    }
                                                    {
                                                        project?.image_name && getFileType(project?.image_name) !== 'pdf' && <img src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} alt={project.title} className='w-full h-40 object-cover' />
                                                    }
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='flex justify-between items-center py-3'>
                                                    <div className='flex items-center'>
                                                        <div>
                                                            <h6>{project.title}</h6>
                                                            <p>{project.institute}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant='destructive' onClick={() => deleteActivityHandler(project?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </div>
                                                <p className='text-gray-400 mt-1'>{new Date(project.start_date || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {project.end_date ? new Date(project.end_date || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}</p>
                                                <p className='mt-2 line-clamp-3'>{project.description}</p>
                                            </CardContent>
                                            <CardFooter>
                                                {project?.action && <div className="flex space-x-4">
                                                    <a href={project?.action} className="text-indigo-600 hover:text-indigo-700 flex items-center" target="_blank" rel="noreferrer">
                                                        <Link2 size={20} className="mr-2" />
                                                        <span>View Project</span>
                                                    </a>
                                                </div>}
                                            </CardFooter>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio?.Project && portfolio?.Project.length === 0 && <p>No project found</p>
                                }
                                {
                                    !portfolio?.Project && <p>No project found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="resume">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Resumes</h2>
                                <Button className='text-white dark:text-black' variant='default' onClick={() => setAddResumeDialog(true)}>Upload Resume</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* resume -> url,id */}
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {
                                    portfolio?.resume?.map((resume, index) => (
                                        <Card key={index}>
                                            <CardHeader className='p-0 rounded-t-lg overflow-hidden'>
                                                <div className='bg-gray-100'>
                                                    {
                                                        resume?.url && getFileType(resume?.url) === 'pdf' && <embed src={resume.url} className='border-none outline-none w-full' />
                                                    }
                                                </div>
                                            </CardHeader>
                                            <CardFooter>
                                                {resume?.url && <div className="flex space-x-4 pt-2">
                                                    <a href={resume?.url} className="text-indigo-600 hover:text-indigo-700 flex items-center" target="_blank" rel="noreferrer">
                                                        <Link2 size={20} className="mr-2" />
                                                        <span>View Resume</span>
                                                    </a>
                                                </div>}
                                            </CardFooter>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio?.resume && portfolio?.resume.length === 0 && <p>No resume found</p>
                                }
                                {
                                    !portfolio?.resume && <p>No resume found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <Education show={showEducationDialog} onClose={setShowEducationDialog} onSuccess={fetchUserPortfolio} />
            <Experience show={showExperienceDialog} onClose={setShowExperienceDialog} onSuccess={fetchUserPortfolio} />
            <Certificate show={showCertificateDialog} onClose={setShowCertificateDialog} onSuccess={fetchUserPortfolio} />
            <Skill show={showSkillDialog} onClose={setShowSkillDialog} onSuccess={fetchUserPortfolio} />
            <Project show={showProjectDialog} onClose={setShowProjectDialog} onSuccess={fetchUserPortfolio} />
            <SocialMedia socialMedia={portfolio?.portfolio_social[0]} show={showSocialMediaDialog} onClose={setShowSocialMediaDialog} onSuccess={fetchUserPortfolio} />
            <PersonalInfo portfolio={portfolio?.portfolio_profile?.length !== 0 ? portfolio?.portfolio_profile[0] : null} show={showPersonalInfoDialog} onClose={setShowPersonalInfoDialog} onSuccess={fetchUserPortfolio} />
            <AddResume show={addResumeDialog} onClose={setAddResumeDialog} onSuccess={fetchUserPortfolio} />
        </>
    )
}

export default memo(PortfolioBuilder);
