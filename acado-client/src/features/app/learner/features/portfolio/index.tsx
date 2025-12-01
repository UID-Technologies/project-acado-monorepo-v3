import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Link2, MapPin, Pencil, Phone, Twitter } from 'lucide-react';
import { BiEnvelope } from 'react-icons/bi';
import { BsInstagram, BsLinkedin } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '@app/store/learner/portfolioStore';
import { addBanner, userPortfolio } from '@services/learner/PortfolioService';
import Loading from '@/components/shared/Loading';
import deafultprofile from '@/assets/images/defaultprofile.jpg';
import { useAuth } from '@app/providers/auth';
import { getFileType } from '@/utils/getFileType';
import Export from './export';
import { Button } from '@/components/ui/ShadcnButton';

const Portfolio: React.FC = () => {

    const { user } = useAuth()

    const { setPortfolio, portfolio, setError, loading, setLoading } = usePortfolioStore();
    const [exportDailog, setExportDialog] = React.useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [bannerFile, setBannerFile] = useState<string | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

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

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            const formData = new FormData();
            formData.append("file", selectedFile);
            addBanner(formData).then(res => {
                console.log(res);
                const blobUrl = URL.createObjectURL(selectedFile);
                // genrate blob and append to portfolio
                setBannerFile(blobUrl);
            }).catch(err => {
                console.log(err);
            });
        }
    };

    if (loading) return <Loading loading={loading} />

    return (
        <>
            <div className="min-h-screen">
                <div
                    className="relative h-64 bg-cover bg-center rounded-t overflow-hidden"
                    style={{
                        backgroundImage: bannerFile
                            ? `url('${bannerFile}')`
                            : portfolio?.banner?.length
                                ? `url('${portfolio.banner[0].url}')`
                                : `url('https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/portfolio.jpg')`,
                    }}
                >
                    <div className="absolute inset-0 bg-indigo-900 bg-opacity-60"></div>
                    <Button
                        size="icon"
                        variant="default"
                        className='absolute top-4 right-4 bg-white dark:bg-gray-900 dark:text-primary'
                        onClick={handleButtonClick}
                    >
                        <Pencil />
                    </Button>
                    <input ref={fileInputRef} type="file" className='absolute top-4 right-4 hidden'
                        onChange={handleFileChange} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow border p-8">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="relative">
                                <img
                                    src={
                                        portfolio?.image
                                            ? portfolio?.image?.replace("/https:", "https:")
                                            : deafultprofile
                                    }
                                    alt="Profile"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <div className="absolute bottom-4 right-4 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                            </div>
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 &&
                                <div className="md:ml-8 mt-4 md:mt-2 text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {portfolio?.portfolio_profile[0]?.name ?? ''} {portfolio?.portfolio_profile[0]?.lastName ?? ''}
                                    </h1>
                                    {
                                        Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 && <div className='flex'>
                                            <p className="text-gray-600 dark:text-gray-300">{portfolio?.portfolio_profile[0]?.email}</p>,&nbsp; <p className="text-gray-600 dark:text-gray-300">{portfolio?.portfolio_profile[0]?.phone}</p></div>
                                    }
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {portfolio?.portfolio_profile[0]?.state}, {portfolio?.portfolio_profile[0]?.country}
                                    </p>
                                    {
                                        Array.isArray(portfolio?.portfolio_social) && portfolio?.portfolio_social.length !== 0 && <div className="mt-4 flex space-x-4 justify-center md:justify-start">
                                            {
                                                portfolio?.portfolio_social[0]?.linkedin &&
                                                <a href={portfolio?.portfolio_social[0]?.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-primary text-xl">
                                                    <BsLinkedin />
                                                </a>
                                            }
                                            {
                                                portfolio?.portfolio_social[0]?.insta &&
                                                <a href={portfolio?.portfolio_social[0]?.insta} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-primary text-xl">
                                                    <BsInstagram />
                                                </a>
                                            }
                                            {
                                                portfolio?.portfolio_social[0]?.twitter &&
                                                <a href={portfolio?.portfolio_social[0]?.twitter} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-primary text-xl">
                                                    <Twitter />
                                                </a>
                                            }
                                            {
                                                portfolio?.portfolio_social[0]?.facebook &&
                                                <a href={portfolio?.portfolio_social[0]?.facebook} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-primary text-xl">
                                                    <FaFacebook />
                                                </a>
                                            }
                                        </div>
                                    }
                                </div>
                            }
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length == 0 &&
                                <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {user.name}
                                    </h1>
                                </div>
                            }
                            <div className="ml-auto mt-4 md:mt-0 flex gap-2">
                                <Link to="/portfolio/edit"
                                    className="rounded bg-primary text-white dark:text-black px-6 py-2 flex items-center space-x-2 transition duration-200"
                                >
                                    <i className="fas fa-edit"></i>
                                    <span>Edit Profile</span>
                                </Link>
                                <button
                                    className="rounded bg-primary text-white dark:text-black px-6 py-2 flex items-center space-x-2 transition duration-200"
                                    onClick={() => setExportDialog(true)}
                                >
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Content Sections */}
                    <div className="mt-8 space-y-8">
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border p-8">
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 &&
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
                                        <p className="mt-2 text-gray-500">
                                            {
                                                portfolio?.portfolio_profile[0]?.about_me
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <BiEnvelope size={20} className="text-gray-400" />
                                                <span className="text-gray-500">
                                                    {
                                                        portfolio?.portfolio_social[0]?.email
                                                    }
                                                </span>
                                            </div>
                                            {
                                                portfolio?.portfolio_profile.length !== 0 &&
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="text-gray-400" />
                                                    <span className="text-gray-500">
                                                        {
                                                            portfolio?.portfolio_profile[0]?.city
                                                        },&nbsp;
                                                        {
                                                            portfolio?.portfolio_profile[0]?.state
                                                        },&nbsp;
                                                        {
                                                            portfolio?.portfolio_profile[0]?.country
                                                        }
                                                    </span>
                                                </div>
                                            }
                                            <div className="flex items-center space-x-2">
                                                <Phone className="text-gray-400" />
                                                <span className="text-gray-500">+91 9876543210</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length === 0 && <p className="text-gray-600">
                                    No data found. Please update your profile.
                                </p>
                            }
                        </div>

                        {
                            portfolio?.skill && portfolio?.skill.length > 0 &&
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <Card>
                                        <CardHeader className="items-center">
                                            <CardTitle>Skills Overview</CardTitle>
                                            <CardDescription>
                                                A summary of my technical skills and proficiencies.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pb-0">
                                            <ChartContainer
                                                config={chartConfig}
                                                className="h-60"
                                            >
                                                <RadarChart data={portfolio?.skill ?? []}>
                                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                    <PolarAngleAxis dataKey="name" />
                                                    <PolarGrid />
                                                    <Radar
                                                        dataKey="self_proficiency"
                                                        fill="var(--primary)"
                                                        fillOpacity={0.5}
                                                        dot={{
                                                            r: 4,
                                                            fillOpacity: 1,
                                                        }}
                                                    />
                                                </RadarChart>
                                            </ChartContainer>
                                        </CardContent>
                                    </Card>
                                    <div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {portfolio?.skill?.map((skill) => (
                                                <div key={skill?.name} className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-gray-500">{skill?.name}</span>
                                                        <span className="text-primary">{skill?.self_proficiency}%</span>
                                                    </div>
                                                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className="h-2 bg-primary rounded-full"
                                                            style={{ width: `${skill?.self_proficiency}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }


                        {
                            portfolio?.Experience && portfolio?.Experience.length > 0 &&
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
                                <div className="space-y-6">
                                    {
                                        portfolio?.Experience?.map((experience, index) => (
                                            <div
                                                key={`exp` + index}
                                                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-start">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${experience?.title}&background=random&color=fff`}
                                                        alt="Company Logo"
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <h3 className="text-xl font-semibold text-gray-900">{experience?.title}</h3>
                                                        <p className="text-gray-600 dark:text-gray-300">
                                                            {experience?.institute}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {
                                                                new Date(experience?.start_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })
                                                            }
                                                            - {
                                                                experience?.end_date ? new Date(experience?.end_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                }) : "Present"
                                                            }

                                                            • {experience?.location}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                                {
                                                                    experience?.description
                                                                }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }

                        {
                            portfolio?.Education && portfolio?.Education.length > 0 &&
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                                <div className="space-y-6">
                                    {
                                        portfolio?.Education?.map((education, index) => (
                                            <div key={`edu` + index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700" >
                                                <div className="flex items-start">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${education?.title}&background=random&color=fff`}
                                                        alt="University Logo"
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <h3 className="text-xl font-semibold text-gray-900">{education?.title}</h3>
                                                        <p className="text-gray-600 dark:text-gray-300">{education?.institute}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {
                                                                new Date(education?.start_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })
                                                            } - {
                                                                education?.end_date ? new Date(education?.end_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                }) : "Present"
                                                            }

                                                            • {education?.location}
                                                        </p>
                                                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                                                            {education?.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        }
                        {portfolio?.Project && portfolio?.Project.length > 0 &&
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {
                                        portfolio?.Project && portfolio?.Project?.map((project, index) => (
                                            <div key={`project-${index}`} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                {
                                                    project?.image_name && getFileType(project?.image_name) === 'pdf' && <embed src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} className='border-none outline-none' />
                                                }
                                                {
                                                    project?.image_name && getFileType(project?.image_name) !== 'pdf' && <img src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} alt={project.title} className='w-full h-40 object-cover' />
                                                }
                                                <div className="p-6">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {
                                                            project?.title
                                                        }
                                                    </h3>
                                                    
                                                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                                                        {
                                                            new Date(project?.start_date + "-01").toLocaleString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })
                                                        } - {
                                                            project?.end_date ? new Date(project?.end_date + "-01").toLocaleString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric'
                                                            }) : "Present"
                                                        }
                                                    </p>

                                                    <p className="mt-2 text-gray-600 dark:text-gray-500">
                                                        {
                                                            project.description
                                                        }
                                                    </p>
                                                    {project?.action && <div className="mt-4 flex space-x-4">
                                                        <a href={project?.action} className="text-primary flex items-center" target="_blank" rel="noreferrer">
                                                            <Link2 size={20} className="mr-2" />
                                                            <span>View Project</span>
                                                        </a>
                                                    </div>}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {
                Array.isArray(portfolio.portfolio_profile) && portfolio.portfolio_profile.length !== 0 && <Export show={exportDailog} setShow={() => setExportDialog(false)} portfolio={portfolio} />
            }
        </>
    );
};
export default Portfolio
