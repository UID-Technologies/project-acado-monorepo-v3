import { Globe, Users2, MessageCircle, Users, Compass, LineChart, FileText, GraduationCap } from "lucide-react"
import React, { useCallback, useEffect, useState } from 'react';
import { useUniversitiesStore } from '@app/store/public/___universitiesStore';
import { useCourseStore } from '@app/store/public/CoursesStore';
import { fetchUniversities, fetchCoursesByUniversityId } from '@services/public/UniversitiesService';
import { Container } from '@/components/shared';
import { Alert, Input } from '@/components/ui';
import ProgramCard from '@public/components/ui/ProgramCard';
import Loading from '@/components/shared/Loading';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { fetchCourses } from "@services/public/CoursesService";

export default function FeatureGrid() {
    const { courses, setCourses, loading, setLoading, setError, error } = useCourseStore();

    useEffect(() => {
        const fetchCourseList = async () => {
            setLoading(true);
            try {
                const moduleResp = await fetchCourses();
                console.log('Fetched Module Data:', moduleResp);
                setCourses(moduleResp);
            } catch (error) {
                console.error('Error fetching module:', error);
                setError('Failed to load module');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseList();
    }, [setLoading, setError]);

    if (loading) {
        return (
            <div className='h-28 flex justify-center items-center'>
                <Loading loading={true} />
            </div>
        )
    }

    if (error) {
        return <Alert title={`Error!: ${error}`} type="danger" />
    }


    return (
        <div className="min-h-screen bg-[#0A0C0F] p-6 md:p-12">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses?.map((courses, index) => (
                        <div key={index} className="bg-[#1A1D21] rounded-xl p-6 hover:bg-[#1E2126] transition-colors duration-200">
                            <div className="mb-4">{courses?.university_image}</div>
                            <h3 className="text-white text-xl font-semibold mb-3">{courses?.university_name}</h3>
                            <p className="text-[#94A3B8] text-sm leading-relaxed">{courses?.university_name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function setError(arg0: string) {
    throw new Error("Function not implemented.");
}

