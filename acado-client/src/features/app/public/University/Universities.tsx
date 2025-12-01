import React, { useEffect, useCallback } from 'react';
import Loading from '@/components/shared/Loading';
import { useUniversitiesStore } from '@app/store/elms/UniversityStore';
import { fetchUniversities } from '@services/elms/UniversityService';
import { University } from '@app/types/elms/university';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';


const Universities: React.FC = () => {
    const {
        universities,
        setUniversities,
        loading,
        setLoading,
        error,
        setError,
    } = useUniversitiesStore();

    const loadUniversities = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetchUniversities();
            setUniversities(response);
        } catch (err) {
            setError('Failed to load universities');
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setUniversities]);

    useEffect(() => {
        loadUniversities();
    }, [loadUniversities]);

    if (loading) return <Loading loading={loading} />;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto px-10">
            <h1 className="text-2xl font-bold mt-10 mb-5 dark:text-darkPrimary text-lightPrimary">
                Universities
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4'>
                {universities && universities?.map((university: University, index) => (
                   

                    <Card
                        key={index}
                        className={`overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer dark:bg-gray-800 dark:text-gray-100 hover:dark:bg-gray-700 bg-white text-gray-900 hover:bg-gray-50 hover:transform hover:scale-95`}
                    >
                        <Link to={`/universities/${university?.id}`}>
                            <div className="relative">
                                <img
                                    src={university?.banner_url && university?.banner_url[0] ||  `https://ui-avatars.com/api/?name=${university.name}`}
                                    alt={university.name}
                                    className="w-full h-96 object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://ui-avatars.com/api/?name=${university.name}&background=random&color=fff`;
                                    }}
                                />
                                <div className="absolute -bottom-6 left-4">
                                    <img
                                        src={university.logo}
                                        alt={`${university.name} logo`}
                                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "https://ui-avatars.com/api/?name=" + university.name + "&background=random&color=fff";
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="p-4 pt-8">
                                <h2 className="text-xl font-semibold line-clamp-2 mb-2">
                                    {university.name}
                                </h2>
                                <p
                                    className={`text-sm mb-4 dark:text-gray-300 text-gray-600 line-clamp-3`}
                                >
                                    {university.org_description}
                                </p>

                                <div
                                    className={`text-sm dark:text-gray-300 text-gray-600`}
                                >
                                    <div className="flex items-start mb-2">
                                        <i className="fas fa-map-marker-alt mt-1 mr-2"></i>
                                        <p className="line-clamp-2">{university.address}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-globe-europe"></i>
                                        <span>
                                            {university.city}, {university.country_name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Universities;
