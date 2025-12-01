// import React, { useEffect } from 'react'
// import { useUniversitiesStore } from '@app/store/public/universitiesStore';
// import { fetchUniversities } from '@services/public/UniversitiesService';
// import Loading from '@/components/shared/Loading';
// import { Alert } from '@/components/ui';

// function Universities() {

//     const { universities, setUniversities, error, loading, setError, setLoading } = useUniversitiesStore()

//     useEffect(() => {
//         const getUniversities = async () => {
//             setLoading(true);
//             setError('');
//             try {
//                 const res = await fetchUniversities();
//                 if (res) {
//                     setUniversities(res);
//                 } else {
//                     setError('No universities found.');
//                 }
//             } catch (err) {
//                 setError('Failed to fetch universities. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getUniversities();
//     }, [setUniversities]);

//     if (loading) return <Loading loading={loading} />
//     if (error) return <Alert type='danger' title={error} />

//     return (
       
//     )
// }

// export default Universities
