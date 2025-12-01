import React, { useEffect } from 'react';
import Loading from '@/components/shared/Loading';
import type { Organization, University } from '@app/types/common/university';
import { useUniversitiesStore } from '@app/store/public/___universitiesStore';
import { fetchUniversities } from '@services/public/UniversitiesService';
import { Link } from 'react-router-dom';
import backgroundImage from '@/assets/images/event.jpg';

const List: React.FC = () => {
    const { universities, setUniversities, loading, setLoading, noFound, setNoFound, error, setError } = useUniversitiesStore();

    // Function to load universities
    const loadUniversities = async () => {
        setLoading(true);
        setError('');
        setNoFound(false); // Reset `noFound` state
        try {
            const response = await fetchUniversities();
            if (response.length === 0) {
                setNoFound(true);
            } else {
                setUniversities(response);
            }
        } catch (err) {
            console.error('Error fetching universities:', err);
            setError(err instanceof Error ? err.message : 'Unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUniversities();
    }, []); // Empty dependency array ensures it runs only once on mount.

    // Conditional Rendering
    if (loading) return <Loading loading={loading} />;
    if (error) return <div className="text-red-600 text-center mt-4">Error: {error}</div>;
    if (noFound) return <div className="text-gray-600 text-center mt-4">No universities found.</div>;

    // Rendered Component
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold dark:text-primary text-primary">Universities</h1>
                <p className="text-gray-600">List of universities</p>
            </div>
            {
                universities?.map((university: Organization) => (
                    <div
                        key={university.id}
                        className="w-full mt-8 rounded-lg overflow-hidden shadow-lg"
                        style={{
                            backgroundImage: Array.isArray(university?.banner_url) && university.banner_url.length > 0
                                ? `url(${university.banner_url[0]})`
                                : `url('/img/event/event.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="p-16 bg-dark"
                            style={{
                                background: "linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0))",
                            }}
                        >
                            <img
                                src={university?.logo}
                                className="w-16 mb-2"
                            />
                            <h1 className="text-2xl font-bold text-gray-800 text-white">{university?.name??''}</h1>
                            <p className="text-lg text-gray-800 text-white">{university?.description??''}</p>
                            <div className='mt-3 flex'>
                                <div>
                                    <button 
                                        className="bg-primary text-ac-dark font-bold py-2 px-3 rounded"
                                        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(university?.name || '')}`, '_blank')}
                                    >
                                        View {university?.type === 'school' ? 'School' : 'University'} Page
                                    </button>
                                </div>
                                <Link to={`/universities-show/${university?.id}`}>
                                    <button className="bg-primary text-ac-dark font-bold py-2 px-3 rounded ml-3">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
};

export default List;
