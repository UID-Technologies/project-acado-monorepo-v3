import React, { useEffect } from 'react'
import { Button } from '@/components/ui'
import { Link } from 'react-router-dom'
import { userPortfolio } from '@services/learner/Portfolio'
import { usePortfolioStore } from '@app/store/learner/portfolioStore'
import Loading from '@/components/shared/Loading'
import Error from '@/components/shared/Error'
import { ProgressBar } from './TopProgressBar'
import { PlusIcon } from 'lucide-react'
import { FileIcon } from 'lucide-react'
import { uploadResume } from '@services/learner/Portfolio'

const Portfolio: React.FC = () => {
    const { setPortfolio, portfolio, error, setError, loading, setLoading } =
        usePortfolioStore()

    useEffect(() => {
        fetchPortfolioData()
    }, [])

    const handleResumeSubmit = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.onchange = async () => {
            const file = fileInput.files?.[0]
            if (file) {
                try {
                    await uploadResume(file)
                    fetchPortfolioData()
                } catch (error) {
                    setError('Failed to upload resume')
                }
            }
        }
        fileInput.click()
    }

    const fetchPortfolioData = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await userPortfolio()
            setPortfolio(data)
        } catch (err) {
            setError('Failed to load portfolio data')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading loading={loading} />
    if (error) return <Error error={error} />

    return (
        <div className="py-4">
            <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary">
                            Portfolio
                        </h1>
                        <p className="text-sm text-slate-700 dark:text-slate-400">
                            Create and manage your professional portfolio
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link to="/portfolio/builder?tab=general">
                            <button
                                className="bg-primary  rounded-xl px-3 py-3 text-black  transition"
                            >
                                Edit Portfolio
                            </button>
                        </Link>
                        <button
                            className="bg-primary rounded-xl px-3 py-3 text-black  transition"
                            onClick={handleResumeSubmit}
                        >
                            Upload Resume
                        </button>
                    </div>
                </div>

                <ProgressBar />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <header
                        id="basic-info"
                        style={{ scrollMarginTop: '195px' }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                <img
                                    src={
                                        portfolio?.image ||
                                        `https://ui-avatars.com/api/?name=${portfolio?.name}`
                                    }
                                    alt="Profile Image"
                                    className="w-16 h-16 rounded-full border-2 border-primary shadow-lg"
                                />
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl font-bold capitalize">
                                        {portfolio?.name || 'Your Name'}
                                    </h1>
                                    {portfolio?.resume?.[0]?.url && (
                                        <a
                                            href={portfolio.resume[0].url}
                                            target="_blank"
                                            className="text-sm flex text-primary hover:underline dark:text-primary mt-1"
                                        >
                                            <FileIcon size={18} className="mr-1" /> View resume
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                                {portfolio?.portfolio_social?.[0]?.insta && (
                                    <Link
                                        to={portfolio.portfolio_social[0].insta}
                                        className="transition duration-100 ease-in-out transform hover:scale-110"
                                        target="_blank"
                                    >
                                        {/* Instagram Icon */}
                                        <svg
                                            width="21"
                                            height="20"
                                            viewBox="0 0 21 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10.0045 4.87225C7.16613 4.87225 4.87672 7.16166 4.87672 10C4.87672 12.8383 7.16613 15.1277 10.0045 15.1277C12.8428 15.1277 15.1322 12.8383 15.1322 10C15.1322 7.16166 12.8428 4.87225 10.0045 4.87225ZM10.0045 13.3337C8.17026 13.3337 6.67076 11.8387 6.67076 10C6.67076 8.16133 8.16579 6.66629 10.0045 6.66629C11.8431 6.66629 13.3382 8.16133 13.3382 10C13.3382 11.8387 11.8387 13.3337 10.0045 13.3337V13.3337ZM16.538 4.6625C16.538 5.32746 16.0025 5.85853 15.342 5.85853C14.677 5.85853 14.1459 5.32299 14.1459 4.6625C14.1459 4.00201 14.6815 3.46647 15.342 3.46647C16.0025 3.46647 16.538 4.00201 16.538 4.6625ZM19.9342 5.87638C19.8583 4.27424 19.4924 2.85507 18.3186 1.68582C17.1494 0.516568 15.7302 0.150619 14.1281 0.070289C12.4769 -0.0234297 7.52761 -0.0234297 5.87638 0.070289C4.2787 0.146156 2.85953 0.512105 1.68582 1.68136C0.512105 2.85061 0.150619 4.26978 0.070289 5.87192C-0.0234297 7.52315 -0.0234297 12.4724 0.070289 14.1236C0.146156 15.7258 0.512105 17.1449 1.68582 18.3142C2.85953 19.4834 4.27424 19.8494 5.87638 19.9297C7.52761 20.0234 12.4769 20.0234 14.1281 19.9297C15.7302 19.8538 17.1494 19.4879 18.3186 18.3142C19.4879 17.1449 19.8538 15.7258 19.9342 14.1236C20.0279 12.4724 20.0279 7.52761 19.9342 5.87638V5.87638ZM17.801 15.8953C17.4529 16.7701 16.779 17.4439 15.8998 17.7965C14.5833 18.3186 11.4593 18.1981 10.0045 18.1981C8.54959 18.1981 5.42118 18.3142 4.10912 17.7965C3.23441 17.4484 2.56053 16.7745 2.20797 15.8953C1.68582 14.5788 1.80632 11.4549 1.80632 10C1.80632 8.54513 1.69028 5.41671 2.20797 4.10465C2.55606 3.22995 3.22995 2.55606 4.10912 2.2035C5.42564 1.68136 8.54959 1.80185 10.0045 1.80185C11.4593 1.80185 14.5878 1.68582 15.8998 2.2035C16.7745 2.5516 17.4484 3.22548 17.801 4.10465C18.3231 5.42118 18.2026 8.54513 18.2026 10C18.2026 11.4549 18.3231 14.5833 17.801 15.8953Z"
                                                fill="#E1306C"
                                            ></path>
                                        </svg>
                                    </Link>
                                )}
                                {portfolio?.portfolio_social?.[0]?.linkedin && (
                                    <Link
                                        to={
                                            portfolio.portfolio_social[0]
                                                .linkedin
                                        }
                                        className="transition duration-100 ease-in-out transform hover:scale-110"
                                        target="_blank"
                                    >
                                        {/* LinkedIn Icon */}
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            {/* ...Icon Path... */}

                                            <path
                                                d="M4.47689 20H0.330365V6.64702H4.47689V20ZM2.40139 4.82555C1.07547 4.82555 0 3.72732 0 2.40139C9.49038e-09 1.7645 0.253003 1.1537 0.703352 0.703352C1.1537 0.253003 1.7645 0 2.40139 0C3.03828 0 3.64909 0.253003 4.09943 0.703352C4.54978 1.1537 4.80279 1.7645 4.80279 2.40139C4.80279 3.72732 3.72687 4.82555 2.40139 4.82555ZM19.996 20H15.8584V13.4999C15.8584 11.9507 15.8271 9.96406 13.7025 9.96406C11.5467 9.96406 11.2163 11.6471 11.2163 13.3882V20H7.07427V6.64702H11.0511V8.46849H11.1092C11.6628 7.41936 13.015 6.31219 15.0325 6.31219C19.229 6.31219 20.0004 9.07565 20.0004 12.665V20H19.996Z"
                                                fill="#4d9feb"
                                            ></path>
                                        </svg>
                                    </Link>
                                )}
                                {portfolio?.portfolio_social?.[0]?.twitter && (
                                    <Link
                                        to={
                                            portfolio.portfolio_social[0]
                                                .twitter
                                        }
                                        className="transition duration-100 ease-in-out transform hover:scale-110"
                                        target="_blank"
                                    >
                                        {/* Twitter Icon */}
                                        <svg
                                            width="25"
                                            height="20"
                                            viewBox="0 0 25 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M22.4303 4.98436C22.4461 5.2031 22.4461 5.42188 22.4461 5.64062C22.4461 12.3125 17.2907 20 7.86805 20C4.96511 20 2.26842 19.1718 0 17.7344C0.412453 17.7812 0.808988 17.7969 1.23731 17.7969C3.63258 17.7969 5.83757 17 7.59837 15.6406C5.34582 15.5938 3.45812 14.1406 2.80773 12.1406C3.12501 12.1875 3.44225 12.2187 3.77541 12.2187C4.23542 12.2187 4.69548 12.1562 5.12375 12.0469C2.77604 11.5781 1.01519 9.54687 1.01519 7.09374V7.03126C1.69727 7.40627 2.49049 7.64064 3.33117 7.67185C1.95108 6.76558 1.04693 5.21873 1.04693 3.46871C1.04693 2.53123 1.30069 1.67186 1.74488 0.921852C4.26711 3.98435 8.05838 5.98432 12.3096 6.2031C12.2303 5.8281 12.1827 5.43752 12.1827 5.04688C12.1827 2.2656 14.467 0 17.3065 0C18.7817 0 20.1142 0.609373 21.0501 1.59375C22.2081 1.37501 23.3185 0.953114 24.3021 0.375003C23.9213 1.5469 23.1123 2.53128 22.0495 3.15624C23.0806 3.04691 24.08 2.7656 25 2.37502C24.3021 3.37498 23.4296 4.26557 22.4303 4.98436V4.98436Z"
                                                fill="#1DA1F2"
                                            ></path>
                                            {/* ...Icon Path... */}
                                        </svg>
                                    </Link>
                                )}
                                {portfolio?.portfolio_social?.[0]?.facebook && (
                                    <Link
                                        to={
                                            portfolio.portfolio_social[0]
                                                .facebook
                                        }
                                        className="transition duration-100 ease-in-out transform hover:scale-110"
                                        target="_blank"
                                    >
                                        {/* Facebook Icon */}
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10 0C4.4775 0 0 4.4775 0 10C0 14.875 3.4375 19.3125 8.125 19.9375V12.5H5.625V10H8.125V8.125C8.125 5.625 9.6875 4.0625 12.1875 4.0625C13.4375 4.0625 14.375 4.1875 14.375 4.1875V6.5625H13.0625C11.9375 6.5625 11.875 7.1875 11.875 7.75V10H14.375L13.75 12.5H11.875V19.9375C16.5625 19.3125 20 14.875 20 10C20 4.4775 15.5225 0 10 0Z"
                                                fill="#1877F2"
                                            ></path>
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </header>
                </div>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Education Section */}
                    <section
                        id="education"
                        style={{ scrollMarginTop: '165px' }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 transition"
                    >
                        <h2 className="text-xl font-bold mb-4 dark:text-primary text-primary">
                            Education
                        </h2>
                        {portfolio?.Education?.length > 0 ? (
                            portfolio?.Education.map((education, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-200 dark:bg-gray-900 p-4 rounded-md mb-3 grid grid-cols-1 md:grid-cols-5 gap-y-4"
                                >
                                    <div className="md:col-span-4">
                                        <h6 className="font-semibold text-base sm:text-lg">
                                            {education?.title}
                                        </h6>
                                        <p className="text-sm sm:text-base">
                                            {education?.institute}
                                        </p>
                                        <p className="mt-2 text-sm sm:text-base">
                                            Field of Study -{' '}
                                            {education?.study_field} || Grade -{' '}
                                            <b>{education?.grade}</b>
                                        </p>
                                    </div>
                                    <div className="md:col-span-1 text-left md:text-right text-sm sm:text-base">
                                        <p>
                                            {formatDate(education?.start_date)}{' '}
                                            -{' '}
                                            {education?.end_date
                                                ? formatDate(
                                                      education?.end_date,
                                                  )
                                                : 'Present'}
                                        </p>
                                        <p className="mt-2">
                                            {education?.location}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No education details available</p>
                        )}
                    </section>

                    {/* Experience Section */}
                    <section
                        id="experience"
                        style={{ scrollMarginTop: '165px' }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 transition"
                    >
                        <h2 className="text-xl font-bold mb-4 dark:text-primary text-primary">
                            Experience
                        </h2>
                        {portfolio?.Experience?.length > 0 ? (
                            portfolio?.Experience.map((experience, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-200 dark:bg-gray-900 p-4 rounded-md mb-3 grid grid-cols-1 md:grid-cols-5 gap-y-4"
                                >
                                    <div className="md:col-span-4">
                                        <h6 className="font-semibold text-base sm:text-lg">
                                            {experience?.title}
                                        </h6>
                                        <p className="text-sm sm:text-base">
                                            {experience?.institute}
                                        </p>
                                        <p className="mt-2 text-sm sm:text-base">
                                            Description -{' '}
                                            {experience?.description}
                                        </p>
                                        {experience?.study_field && (
                                            <p className="text-sm sm:text-base">
                                                {experience?.study_field}
                                            </p>
                                        )}
                                    </div>
                                    <div className="md:col-span-1 text-left md:text-right text-sm sm:text-base">
                                        <p>
                                            {formatDate(experience?.start_date)}{' '}
                                            -{' '}
                                            {experience?.end_date
                                                ? formatDate(
                                                      experience?.end_date,
                                                  )
                                                : 'Present'}
                                        </p>
                                        <p className="mt-3">
                                            {experience?.location}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No experience details available</p>
                        )}
                    </section>

                    {/* Certifications Section */}
                    <section
                        id="certifications"
                        style={{ scrollMarginTop: '165px' }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 transition"
                    >
                        <h2 className="text-xl font-bold mb-4 dark:text-primary text-primary">
                            Certifications / Awards
                        </h2>
                        {portfolio?.certificate?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {portfolio.certificate.map(
                                    (certification, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-100 dark:bg-gray-900 border p-3 text-white rounded-lg shadow-lg transform hover:scale-105 transition"
                                        >
                                            <img
                                                src={`https://elms.edulystventures.com/portfolio/${certification.image_name}`}
                                                alt={certification?.title}
                                                className="w-full h-40 object-cover rounded-t-lg"
                                            />
                                            <div className="pt-3">
                                                <h6 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                                                    {certification?.title}
                                                </h6>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                                    {certification.institute}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                                    {formatDate(
                                                        certification.start_date,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatDate(
                                                        certification.end_date,
                                                    ) || 'No Expiry'}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p>No certifications available</p>
                        )}
                    </section>

                    {/* Skills Section */}
                    <section
                        id="skills"
                        style={{ scrollMarginTop: '165px' }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 transition"
                    >
                        <h2 className="text-xl font-bold mb-4 dark:text-primary text-primary">
                            Skills
                        </h2>
                        {Array.isArray(portfolio?.skill) &&
                        portfolio?.skill?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {portfolio?.skill?.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg"
                                    >
                                        <h3 className="font-semibold text-base sm:text-lg">
                                            {skill?.name}
                                        </h3>
                                        <progress
                                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"
                                            value={skill?.self_proficiency || 0}
                                            max="100"
                                        />
                                        <p className="text-sm mt-2">
                                            {skill?.self_proficiency || 0}%
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No skills available</p>
                        )}
                    </section>

                    {/* Projects Section */}
                    <section
                        id="projects"
                        style={{ scrollMarginTop: '165px' }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 transition"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-xl font-bold dark:text-primary text-primary">
                                Projects
                            </h2>
                        </div>
                        {portfolio?.Project?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {portfolio.Project.map((project, index) => (
                                    <a
                                        href={project.action || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={project.id || index}
                                        className="bg-gray-100 dark:bg-gray-900 border p-3 text-white rounded-lg shadow-lg transform hover:scale-105 transition cursor-pointer"
                                    >
                                        <img
                                            src={`https://elms.edulystventures.com/portfolio/${project.image_name}`}
                                            alt={project?.title}
                                            className="w-full h-40 object-cover rounded-t-lg"
                                        />
                                        <div className="pt-3">
                                            <h6 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                                                {project?.title}
                                            </h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                                {project.institute}
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                                {formatDate(project.start_date)}{' '}
                                                - {formatDate(project.end_date)}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p>No projects available</p>
                        )}
                    </section>

                    {/* Awards Section */}
                    {/* <section
                        id="awards"
                        style={{ scrollMarginTop: '165px' }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 transition"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-xl font-bold dark:text-primary text-primary">
                                Awards
                            </h2>
                            <Link to="/portfolio/builder?tab=awards">
                                <PlusIcon size={24} className="text-primary" />
                            </Link>
                        </div>
                        <div className="h-48 flex justify-center items-center text-center">
                            <p>
                                No Awards available, click the button above to
                                add an award
                            </p>
                        </div>
                    </section> */}

                    {/* Interests Section */}
                    {/* <section
                        id="interests"
                        style={{ scrollMarginTop: '165px' }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 transition"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-xl font-bold dark:text-primary text-primary">
                                Interests
                            </h2>
                            <Link to="/portfolio/builder?tab=interests">
                                <PlusIcon size={24} className="text-primary" />
                            </Link>
                        </div>
                        <div className="h-48 flex justify-center items-center text-center">
                            <p>
                                No Interests available, click the button above
                                to add an interest
                            </p>
                        </div>
                    </section> */}
                </main>
            </div>
        </div>
    )
}

const formatDate = (dateString?: string) => {
    const date = new Date(`${dateString}-01`)
    const options = {
        year: 'numeric',
        month: 'short',
    } as Intl.DateTimeFormatOptions
    return date.toLocaleDateString('en-US', options) // Outputs in format like "Dec 2023"
}

export default Portfolio
