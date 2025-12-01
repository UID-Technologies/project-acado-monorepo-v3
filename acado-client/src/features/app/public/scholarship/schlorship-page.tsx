import type React from 'react'

import { scholarshipData } from '@features/app/learner/scholarship/content'
// import {
//     fetchSchlorship,
//     fetchSchlorshipPublic,
// } from '@services/learner/EventService'
import Error from '@/components/shared/Error'
import {
    Star,
    Users,
    Clock,
    Trophy,
    Shield,
    Globe,
    GraduationCap,
    ScrollText,
    Search,
    X,
} from 'lucide-react'
import Loading from '@/components/shared/Loading'
import { useRef, useState } from 'react'
import SchlorshipBanner from '@/assets/images/schlorship.avif'
import { useNavigate } from 'react-router-dom'
import 'animate.css'
import { usePublicEvents } from '@app/hooks/data/collaborate/useEvents'
import { Event } from '@app/types/collaborate/events'

const iconMap = {
    Star,
    Users,
    Clock,
    Trophy,
    Shield,
    Globe,
    GraduationCap,
    ScrollText,
    Search,
}

export default function ScholarshipPage() {

    const params = new URLSearchParams();
    params.append('type', 'scholarship');

    const { data: events, isLoading, isError, error } = usePublicEvents(params);
    const { hero, features } = scholarshipData
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigate = useNavigate()
    const eventListRef = useRef<HTMLDivElement | null>(null)

    const getIcon = (iconName: keyof typeof iconMap) => {
        const Icon = iconMap[iconName]
        return <Icon className="w-6 h-6" />
    }


    const closeModal = () => {
        setShowModal(false)
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
        })
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would normally send the data to your backend
        console.log('Form submitted:', formData)
        // Show success message
        setIsSubmitted(true)
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
            closeModal()
        }, 3000)
    }

    if (isLoading) {
        return <Loading loading={isLoading} />
    }

    if (isError) {
        return <Error error={error.message} />
    }

    const handleCardClick = (eventItem: Event) => {
        navigate(`/schlorship-details/${eventItem.id}`, {
            state: { event: eventItem },
        })
    }

    return (
        <div className="min-h-screen dark:bg-gray-800 bg-gray-200 dark:text-white text-gray-800">
            {/* Hero Section */}
            <div className="container mx-auto px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-4xl lg:text-5xl animate__animated animate__fadeIn font-bold leading-relaxed dark:text-white text-gray-900">
                            {hero.title}
                        </h1>
                        <p className="text-gray-500 animate__animated animate__fadeIn text-lg">
                            {hero.description}
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src={SchlorshipBanner || '/placeholder.svg'}
                            alt="Scholarship Mentor"
                            className="rounded-2xl animate__animated animate__fadeIn w-full"
                        />
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mt-24 animate__animated animate__fadeInDown p-8 dark:bg-gray-900 bg-gray-100 rounded-2xl">
                    {features.map((feature) => (
                        <div key={feature.id} className="text-center space-y-4">
                            <div className="w-12 h-12 mx-auto bg-primary rounded-xl flex items-center justify-center text-white">
                                {getIcon(feature.icon as keyof typeof iconMap)}
                            </div>
                            <h3 className="text-xl dark:text-primary text-primary font-semibold">
                                {feature.title}
                            </h3>
                            <p className="dark:text-slate-400 text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <section>
                    {events?.length !== 0 && (
                        <h1 className="text-4xl lg:text-3xl font-bold ml-4 leading-tight dark:text-primary mt-8 mb-4 text-primary">
                            Schlorship Programs
                        </h1>
                    )}
                    <div ref={eventListRef} className="container mx-auto p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events &&
                                events?.length > 0 &&
                                events.map((eventItem, index) => (
                                    <div
                                        key={index}
                                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer ${new Date(eventItem.end_date) <
                                            new Date()
                                            ? ''
                                            : 'border border-primary dark:border-primary'
                                            }`}
                                        onClick={() =>
                                            handleCardClick(eventItem)
                                        }
                                    >
                                        <div className="relative">
                                            <img
                                                src={eventItem.image}
                                                alt="event"
                                                className="h-48 w-full object-cover"
                                            />
                                        </div>
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90 w-full">
                                            <div className="flex flex-col">
                                                <h6
                                                    className={`font-bold text-sm mt-1 ${new Date(
                                                        eventItem.end_date,
                                                    ) < new Date()
                                                        ? 'text-gray-800 dark:text-white'
                                                        : 'text-primary dark:text-darkPrimary'
                                                        }`}
                                                >
                                                    {eventItem.name}
                                                </h6>
                                                <div className="flex items-center justify-start">
                                                    <span className="text-sm font-medium mt-1 text-gray-600 dark:text-gray-400">
                                                        {new Date(
                                                            eventItem.start_date,
                                                        ).toLocaleDateString(
                                                            'en-GB',
                                                            {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </span>
                                                    <span className="mx-1">
                                                        -
                                                    </span>
                                                    <span className="text-sm font-medium mt-1 text-gray-600 dark:text-gray-400">
                                                        {new Date(
                                                            eventItem.end_date,
                                                        ).toLocaleDateString(
                                                            'en-GB',
                                                            {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div>
                                                <div
                                                    className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4"
                                                    dangerouslySetInnerHTML={{
                                                        __html: eventItem.description,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Lead Capture Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={closeModal}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {!isSubmitted ? (
                            <>
                                <h3 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">
                                    Apply for
                                </h3>
                                <p className="text-slate-400 mb-6">
                                    Fill out the form below to apply for this
                                    scholarship category.
                                </p>

                                <form
                                    className="space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-1"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            className="w-full px-4 py-2 border dark:border-gray-600 border-gray-300 rounded-lg dark:bg-gray-700 bg-white dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-1"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            className="w-full px-4 py-2 border dark:border-gray-600 border-gray-300 rounded-lg dark:bg-gray-700 bg-white dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-1"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            className="w-full px-4 py-2 border dark:border-gray-600 border-gray-300 rounded-lg dark:bg-gray-700 bg-white dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-1"
                                        >
                                            Why are you interested?
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            rows={3}
                                            className="w-full px-4 py-2 border dark:border-gray-600 border-gray-300 rounded-lg dark:bg-gray-700 bg-white dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
                                    >
                                        Submit Application
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 dark:text-white text-gray-900">
                                    Application Submitted!
                                </h3>
                                <p className="text-slate-400">
                                    Thank you for your interest in{' '}
                                    {`We'll`} contact you soon.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
