import { lazy, Suspense, useState } from 'react'
import {
    LAYOUT_COLLAPSIBLE_SIDE,
    LAYOUT_COLLAPSIBLE_HIDE_SIDE_MENU,
    LAYOUT_BLANK
} from '@app/config/constants/theme.constant'
import Loading from '@/components/shared/Loading'
import type { CommonProps } from '@app/types/common'
import type { JSX, LazyExoticComponent } from 'react'
import type { LayoutType } from '@app/types/theme'
import { useAuth } from '@app/providers/auth'
import LearnerIntroStepPopup from './components/LearnerIntro'
// import JSX


type Layouts = Record<
    string,
    LazyExoticComponent<<T extends CommonProps>(props: T) => JSX.Element>
>

interface PostLoginLayoutProps extends CommonProps {
    layoutType: LayoutType
}

const layouts: Layouts = {
    [LAYOUT_COLLAPSIBLE_SIDE]: lazy(
        () => import('./components/CollapsibleSide'),
    ),
    [LAYOUT_COLLAPSIBLE_HIDE_SIDE_MENU]: lazy(
        () => import('./components/CollapsibleSideHideMenu'),
    ),
    [LAYOUT_BLANK]: lazy(
        () => import('./components/Blank'),
    ),
}

const PostLoginLayout = ({ layoutType, children }: PostLoginLayoutProps) => {
    
    const AppLayout = layouts[layoutType] ?? layouts[Object.keys(layouts)[0]];
    const { user } = useAuth();
    const [popup, setPopup] = useState<boolean>((user?.authority?.includes('Learner') && user?.is_interest_save == null) ? true : false);

    const handlePopup = () => {
        const sessionUser = JSON.parse(localStorage.getItem("sessionUser") || "{}");
        sessionUser.state.user.is_interest_save = 1;
        localStorage.setItem("sessionUser", JSON.stringify(sessionUser));
        setPopup(false);
    }

    return (
        <Suspense fallback={(
            <div className="flex flex-auto flex-col h-[100vh]">
                <Loading loading={true} />
            </div>
        )}>
        {/* {(user.authority?.includes('Learner') && user.is_interest_save == null) ? <LearnerIntroStepPopup /> : <AppLayout>{children}</AppLayout> } */}
            {popup ? <LearnerIntroStepPopup handlePopup={handlePopup} /> : <AppLayout>{children}</AppLayout>}
        </Suspense>
    )

    return <AppLayout>{children}</AppLayout>
}

export default PostLoginLayout
