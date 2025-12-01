import { Book, Clock, User, Calendar, Building2, Eye, CheckCircle2, AlertCircle, ThumbsUp, MessageCircle } from 'lucide-react'
import { fetchSelfAssessment } from '@services/public/SelfAssessmentService'
import { useSelfAssessmentStore } from '@app/store/public/selfAssessmentStore'
import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loading from '@/components/shared/Loading'
import Alert from '@/components/ui/Alert'

export default function SelfAssessmentList() {
    const { selfAssessment, setSelfAssessment, error, setError, setIsLoading, isLoading } = useSelfAssessmentStore()
    const location = useLocation()
    const navigate = useNavigate()
    const category_id = location.state?.category_id

    useEffect(() => {
        setIsLoading(true)
        fetchSelfAssessment(category_id)
            .then((response) => {
                setSelfAssessment(response)
            })
            .catch((error) => {
                setError(error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const getCardColor = (status: string, isAttempted: number) => {
        if (isAttempted) return 'bg-green-50 border-green-100 dark:bg-gray-700'
        if (status === 'Active') return 'bg-blue-50 border-blue-100 dark:bg-gray-700'
        return 'bg-gray-50 border-gray-100'
    }

    const handleAttempt = (assessmentId: any) => {
        console.log("Assessment attempt confirmed");
        navigate(`/assessmentQuestion/${assessmentId}`);
    };



    if (isLoading) {
        return <Loading loading={isLoading} />;
    }

    if (error) {
        return <Alert title={`Error: ${error}`} type="danger" />;
    }

    return (
        <div className="p-6 space-y-4">
            {selfAssessment?.length > 0 && (
                selfAssessment.map((assessment) => (
                    <div
                        key={assessment.id}
                        className={`rounded-lg border p-6 ${getCardColor(assessment?.status, assessment?.is_attempt)}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full mt-2.5 ${assessment?.is_attempt ? 'bg-green-400' :
                                    assessment?.status === 'Active' ? 'bg-blue-400 dark:bg-gray-700' :
                                        'bg-gray-400'
                                    }`} />
                                <div>
                                    <h3 className="text-lg font-semibold dark:text-primary text-primary">
                                        {assessment?.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{assessment?.description}</p>
                                </div>
                            </div>
                            <StatusBadge status={assessment?.status} isAttempted={assessment.is_attempt} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 dark:text-gray-400" />
                                <span className='dark:text-gray-400'>Start: {formatDate(assessment?.start_date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 dark:text-gray-400" />
                                <span className='dark:text-gray-400'>End: {formatDate(assessment?.end_date)}</span>
                            </div>

                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                className="inline-flex items-center gap-2 rounded-full bg-primary dark:bg-primary px-4 py-2 text-sm font-medium text-white dark:text-gray-700 shadow-sm hover:bg-gray-50"
                                onClick={() => handleAttempt(assessment?.program_content_id)}
                            >

                                Attempt Assessment
                            </button>

                        </div>
                    </div>
                )))}

            {
                selfAssessment?.length === 0 && (
                    <div className="flex items-center justify-center h-96">
                        <div className="flex flex-col items-center gap-4">
                            <Book className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                            <h3 className="text-2xl font-semibold dark:text-primary text-primary">No Assessments Available</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center">There are no assessments available for this category.</p>
                        </div>
                    </div>
                )
            }

        </div>
    )
}
const StatusBadge = ({ status, isAttempted }: { status: string; isAttempted: number }) => {
    const getStatusConfig = () => {
        if (isAttempted) {
            return {
                style: 'bg-green-100 text-green-700',
                icon: <CheckCircle2 className="w-4 h-4" />,
                label: 'Completed'
            }
        }

        if (status === 'Active') {
            return {
                style: 'bg-blue-100 text-blue-700',
                icon: <Clock className="w-4 h-4" />,
                label: 'In Progress'
            }
        }

        return {
            style: 'bg-gray-100 text-gray-700',
            icon: <AlertCircle className="w-4 h-4" />,
            label: status
        }
    }

    const config = getStatusConfig()

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.style}`}>
            {config.icon}
            {config.label}
        </span>
    )
}

