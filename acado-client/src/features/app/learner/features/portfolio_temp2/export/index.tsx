import React, { useRef } from 'react'
import { UserPortfolio } from '@app/types/learner/portfolio'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

interface ExportProps {
    show: boolean
    setShow: (show: boolean) => void
    portfolio: UserPortfolio
}

const Export: React.FC<ExportProps> = ({ show, setShow, portfolio }) => {
    const page1Ref = useRef<HTMLDivElement>(null)
    const page2Ref = useRef<HTMLDivElement>(null)
    const page3Ref = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = React.useState(false)

    const exportToPDF = async () => {
        setLoading(true)
        const pdf = new jsPDF('p', 'mm', 'a4') // A4 size

        const generatePage = async (ref: React.RefObject<HTMLDivElement | null>) => {
            if (!ref.current) return null
            const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true })
            return canvas.toDataURL('image/png')
        }

        const addImageToPDF = (imgData: string, isFirstPage: boolean) => {
            const imgWidth = 210 // A4 width in mm
            const pageHeight = 297 // A4 height in mm
            const imgHeight = (page1Ref.current!.offsetHeight * imgWidth) / page1Ref.current!.offsetWidth

            if (!isFirstPage) pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight > pageHeight ? pageHeight : imgHeight)
        }

        // Generate images for each page
        const img1 = await generatePage(page1Ref)
        const img2 = await generatePage(page2Ref)
        const img3 = await generatePage(page3Ref)

        if (img1) addImageToPDF(img1, true)
        if (img2) addImageToPDF(img2, false)
        if (img3) addImageToPDF(img3, false)

        pdf.save('resume.pdf')
        setShow(false)
        toast.success('Portfolio exported successfully')
        setLoading(false)
    }

    return (
        <Dialog open={show} onOpenChange={() => setShow(false)}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Export Portfolio</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Download your resume in a professional format as a PDF.
                    </DialogDescription>
                </DialogHeader>

                <div className="h-96 overflow-auto p-4 bg-gray-100">
                    {/* Page 1 - Header, Skills, Projects, Certificates */}
                    <div
                        ref={page1Ref}
                        className="bg-white p-8 shadow-lg rounded-md text-gray-900 w-full max-w-2xl mx-auto mb-4"
                    >
                        {/* Header - Name & Contact */}
                        <div className="text-center">
                            <h1 style={{color: "black"}} className="text-2xl font-extrabold uppercase text-gray-900 tracking-wide">
                                {portfolio?.portfolio_profile[0]?.name} {portfolio?.portfolio_profile[0]?.lastName}
                            </h1>
                            <p className="text-gray-600 text-sm mt-1 font-medium">
                                {portfolio?.portfolio_profile[0]?.state}, {portfolio?.portfolio_profile[0]?.country}
                            </p>
                        </div>
                        <hr className="border-gray-400 my-4" />

                        {/* About Me */}
                        <div className="mb-6">
                            <h2 style={{color: "black"}} className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">About Me</h2>
                            <p className="text-gray-700 text-sm leading-relaxed mt-2">{portfolio?.portfolio_profile[0]?.about_me}</p>
                        </div>

                        {/* Skills */}
                        {portfolio?.skill?.length > 0 && (
                            <div className="mb-6">
                                <h2 style={{color: "black"}} className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">Skills</h2>
                                <ul className="text-gray-700 text-sm grid grid-cols-2 gap-2 mt-2">
                                    {portfolio?.skill.map((skill, index) => (
                                        <li key={index} className="flex items-center">
                                            ✅ {skill.name} <span className="ml-2 text-gray-500">({skill.self_proficiency}%)</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Projects and Certifications */}
                        <div className="flex w-full justify-between gap-5">
                            {/* Projects */}
                            {portfolio?.Project?.length > 0 && (
                                <div className="mb-6 w-1/2">
                                    <h2 style={{color: "black"}} className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">Projects</h2>
                                    {portfolio?.Project.map((project, index) => (
                                        <div key={index} className="mt-4">
                                            <h6 style={{color: "black"}} className="text-md font-semibold text-gray-800">{project.title}</h6>
                                            <p className="text-gray-700 text-sm">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Certificates */}
                            {portfolio?.Certificate?.length > 0 && (
                                <div className="mb-6 w-1/2">
                                    <h2  style={{color: "black"}} className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">Certifications</h2>
                                    {portfolio?.Certificate.map((certificate, index) => (
                                        <div key={index} className="mt-4">
                                            <h6 style={{color: "black"}} className="text-md font-semibold text-gray-800">{certificate.title}</h6>
                                            <p className="text-gray-600 text-sm">{certificate.end_date}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Page 2 - Work Experience */}
                    <div ref={page2Ref} className="bg-white p-8 shadow-lg rounded-md w-full max-w-2xl mx-auto mb-4">
                        <h2 style={{color: "black"}} className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">Work Experience</h2>
                        {portfolio?.Experience?.map((exp, index) => (
                            <div key={index} className="mt-2">
                                <h6 style={{color: "black"}} className="text-md font-semibold text-gray-800">{exp.title}</h6>
                                <p className="text-gray-600 text-sm">{exp.institute} | {exp.location}</p>
                                <p className="text-gray-500 text-xs">{exp.start_date} - {exp.end_date || 'Present'}</p>
                                <p className="text-gray-500 mt-1">{exp.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Page 3 - Education */}
                    <div ref={page3Ref} className="bg-white p-8 shadow-lg rounded-md w-full max-w-2xl mx-auto">
                        <h2 style={{color: "black"}} className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">Education</h2>
                        {portfolio?.Education?.map((edu, index) => (
                            <div key={index} className="mt-4">
                                <h6 style={{color: "black"}} className="text-md font-semibold text-gray-800">{edu.title}</h6>
                                <p className="text-gray-600 text-sm">{edu.institute} | {edu.location}</p>
                                <p className="text-gray-500 text-xs">{edu.start_date} - {edu.end_date || 'Present'}</p>
                                <p className="text-gray-500 mt-1">{edu.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <button className="bg-indigo-600 text-white px-5 py-2 rounded-md" onClick={exportToPDF}>
                        {loading ? 'Exporting...' : 'Export'}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Export
