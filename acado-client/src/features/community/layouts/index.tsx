import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';


interface Props {
    active?: 'mywall' | 'myposts' | 'mycommunities' | 'discover';
    children: React.ReactNode;
}

const CommunityLayout = ({ active, children }: Props) => {

    const activeTabClass = 'relative before:absolute before:-bottom-1 before:left-0 before:h-[2px] before:w-full before:bg-primary text-primary font-semibold';

    return (
        <>
            <div className='hidden md:flex justify-between items-center border-b pr-5 pb-1 sticky top-16 z-10 py-2 dark:bg-black bg-white'>
                <div className='flex justify-between items-center gap-9'>
                    <Button asChild variant="ghost" className={`font-semibold text-lg hover:bg-transparent ${active === 'mywall' ? activeTabClass : 'dark:text-gray-300 text-gray-700'}`}>
                        <Link to='/community/wall'>Wall</Link>
                    </Button>
                    <Button asChild variant="ghost" className={`font-semibold text-lg hover:bg-transparent ${active === 'mycommunities' ? activeTabClass : 'dark:text-gray-300 text-gray-700'}`}>
                        <Link to='/community/mycommunities'>My Communities</Link>
                    </Button>
                    <Button asChild variant="ghost" className={`font-semibold text-lg hover:bg-transparent ${active === 'discover' ? activeTabClass : 'dark:text-gray-300 text-gray-700'}`}>
                        <Link to='/community/discover'>Discover</Link>
                    </Button>
                </div>
            </div>
            <div className='p-4'>
                {children}
            </div>
        </>
    )
}

export default CommunityLayout;