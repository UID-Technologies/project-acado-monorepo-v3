import { PlayIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Loading from '@/components/shared/Loading';

import { fetchAppliedUniversities } from '@services/learner/AppliedUniversityService';
import { useAppliedUniversityListStore } from '@app/store/learner/appliedUniversityStore';

const AppliedUniversityList: React.FC = () => {
    const { universityList, setUniversityList, error, setError, loading, setLoading } = useAppliedUniversityListStore();

    useEffect(() => {
        setLoading(true);
        fetchAppliedUniversities().then((response) => {
            setUniversityList(response);
        }).catch((error) => {
            setError(error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div className='bg-white p-4 rounded-lg dark:bg-gray-800 overflow-hidden mb-6'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold capitalize text-lg mb-3'>Applied University</h1>
                <Link to={'/'} className='text-primary rounded py-2 px-3 font-bold flex items-center justify-center gap-2'>
                    View All
                    <BiRightArrowAlt size={20} className='inline' />
                </Link>
            </div>
            {
                loading ? (
                    <Loading loading={loading} />
                ) : universityList && universityList.length > 0 ? (
                    universityList.map((university: any) => (
                        <Link to={`/courses-show/${university.ID}`} className="group" key={university.id}>
                            <div className='group block md:flex items-center mb-3 rounded transform transition-transform hover:scale-[1.02] dark:bg-gray-700 bg-gray-200'>
                                <img src={university?.logo ? university?.logo : `https://ui-avatars.com/api/?name=${university?.name}`} alt={`${university?.name}`} className='w-full md:w-48 h-28 rounded-t md:rounded-l md:rounded-r-none' />
                                <div className='p-3 md:px-3 md:py-0'>
                                    <h6 className='font-semibold capitalize dark:text-primary text-primary'>
                                        {university?.name?.length > 50 ? university?.name.substring(0, 50) + '...' : university?.name}
                                    </h6>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No applied universities.</p>
                )
            }
        </div>
    )
}

export default AppliedUniversityList;
