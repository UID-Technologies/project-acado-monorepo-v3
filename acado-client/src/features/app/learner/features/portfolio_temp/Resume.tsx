import React, { useEffect } from 'react';
import { Button } from '@/components/ui';
import { Link } from 'react-router-dom';
import { userPortfolio } from '@services/learner/Portfolio';
import { usePortfolioStore } from '@app/store/learner/portfolioStore';
import Loading from '@/components/shared/Loading';
import Error from '@/components/shared/Error';
import jsPDF from 'jspdf';
import Template1 from './template/Template1';
import Template2 from './template/Template2';
import Template3 from './template/Templete3';
import Template4 from './template/Template4';

const Resume: React.FC = () => {
    const { setPortfolio, portfolio, error, setError, loading, setLoading } = usePortfolioStore();
    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await userPortfolio();
            setPortfolio(data);
        } catch (err) {
            setError('Failed to load portfolio data');
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <Loading loading={loading} />;
    if (error) return <Error error={error} />;

    return (
        <div className="py-4">
            <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary dark:text-primary">Resume</h1>
                    <p className="text-slate-700 dark:text-slate-500">Create and manage your professional resume</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/portfolio/builder">
                        <Button variant="solid" className="text-ac-dark bg-primary hover:bg-primary-mild transition">
                            Edit Resume
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <Template4 portfolio={portfolio} />
                </div>
            </div>
        </div>
    );
};

const formatDate = (dateString?: string) => {
    const date = new Date(`${dateString}-01`);
    const options = { year: 'numeric', month: 'short' } as Intl.DateTimeFormatOptions;
    return date.toLocaleDateString('en-US', options); // Outputs in format like "Dec 2023"
};

export default Resume;
