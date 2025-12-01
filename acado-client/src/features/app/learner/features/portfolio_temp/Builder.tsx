import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import Error from '@/components/shared/Error'

// Section Components
import GeneralInformation from '@portfolio/builder/GeneralInformation'
import SocialInformation from '@portfolio/builder/SocialInformation'
import Education from '@features/app/learner/features/portfolio_temp2/builder/Education'
import Experience from '@features/app/learner/features/portfolio_temp2/builder/Experience'
import Certificate from '@features/app/learner/features/portfolio_temp2/builder/Certificate'
import Skill from '@features/app/learner/features/portfolio_temp2/builder/Skill'
import Projects from '@portfolio/builder/Projects'
import Awards from '@portfolio/builder/Awards'
import Interests from '@portfolio/builder/Interests'

// State and Services
import { userPortfolio } from '@services/learner/Portfolio'
import { usePortfolioStore } from '@app/store/learner/portfolioStore'

const Builder: React.FC = () => {
    const location = useLocation()
    const [tab, setTab] = useState<string | null>(null)

    const {
        setPortfolio,
        portfolio,
        error,
        setError,
        loading,
        setLoading,
        clearPortfolio,
    } = usePortfolioStore()

    // Track tab changes from query param
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        setTab(queryParams.get('tab'))
    }, [location])

    // Load portfolio on mount
    useEffect(() => {
        const localData = localStorage.getItem('portfolioData')
        if (localData) {
            setPortfolio(JSON.parse(localData))
            setLoading(false)
        } else {
            setLoading(true)
            setError('')
            userPortfolio()
                .then((data) => {
                    setPortfolio(data)
                })
                .catch(() => {
                    setError('Failed to load portfolio.')
                })
                .finally(() => setLoading(false))
        }
    }, [])

    // Sync updated portfolio to localStorage
    useEffect(() => {
        if (portfolio) {
            localStorage.setItem('portfolioData', JSON.stringify(portfolio))
        }
    }, [portfolio])

    if (loading || !portfolio) return <Loading loading={true} />
    if (error) return <Error error={error} />

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-primary dark:text-primary text-xl md:text-3xl">
                        Resume Builder
                    </h1>
                    <p className="text-slate-700 dark:text-slate-500">
                        Create your resume with ease
                    </p>
                </div>
                <Link to="/portfolio">
                    <Button variant="solid" className="text-ac-dark">
                        Preview Resume
                    </Button>
                </Link>
            </div>

            {/* Main content */}
            <div className="flex flex-col md:flex-row gap-6 my-[2rem]">
                {/* Left (Content Area) */}
                <div className="w-full md:w-[75%]">
                    {!isMobile ? (
                        <>
                            {tab == 'general' && (
                                <>
                                    <GeneralInformation portfolio={portfolio} />
                                    <SocialInformation
                                        portfolio={
                                            portfolio?.portfolio_social ?? []
                                        }
                                    />
                                </>
                            )}

                            {tab === 'education' && (
                                <Education
                                    educations={portfolio.Education ?? []}
                                />
                            )}
                            {tab === 'experience' && (
                                <Experience
                                    experiences={portfolio.Experience ?? []}
                                />
                            )}
                            {tab === 'certificate' && (
                                <Certificate
                                    certificates={portfolio.certificate ?? []}
                                />
                            )}
                            {tab === 'skills' && <Skill />}
                            {tab === 'projects' && (
                                <Projects projects={portfolio.Project ?? []} />
                            )}
                            {/* {tab === 'awards' && <Awards awards={portfolio.awards ?? []} />} */}
                            {/* {tab === 'interests' && <Interests interests={portfolio.interests ?? []} />} */}

                            {/* Mobile view: show all sections in one tab */}
                        </>
                    ) : (
                        <>
                            <div className="block md:hidden">
                                <GeneralInformation portfolio={portfolio} />
                                <SocialInformation
                                    portfolio={
                                        portfolio?.portfolio_social ?? []
                                    }
                                />
                                <Education
                                    educations={portfolio.Education ?? []}
                                />
                                <Experience
                                    experiences={portfolio.Experience ?? []}
                                />
                                <Certificate
                                    certificates={portfolio.certificate ?? []}
                                />
                                <Skill />
                                <Projects projects={portfolio.Project ?? []} />
                                {/* <Awards awards={portfolio.awards ?? []} /> */}
                                {/* <Interests interests={portfolio.interests ?? []} /> */}
                            </div>
                        </>
                    )}
                </div>

                {/* Right (Sidebar Nav) */}
                <div className="w-full md:w-[25%] hidden md:block">
                    <div className="border shadow-md border-l-4 border-primary p-4 rounded-lg sticky top-24">
                        <div className="flex items-center gap-2 border-b border-primary pb-3">
                            <span className="text-primary font-semibold">
                                Manage Your Resume
                            </span>
                        </div>
                        <ul className="list-none pt-3 ver-nav space-y-2">
                            {[
                                ['general', 'Personal Information'],
                                ['education', 'Education'],
                                ['experience', 'Experience'],
                                ['certificate', 'Certificate / Awards'],
                                ['skills', 'Skills'],
                                ['projects', 'Projects'],
                                // ['awards', 'Awards'],
                                // ['interests', 'Interests'],
                            ].map(([value, label]) => (
                                <li key={value}>
                                    <Link
                                        to={`/portfolio/builder?tab=${value}`}
                                        className={`block transition duration-300 rounded dark:text-slate-300 ${
                                            tab === value ||
                                            (!tab && value === 'general')
                                                ? 'text-primary font-semibold'
                                                : ''
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Builder
