import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import AllRoutes from '@app/router/route/AllRoutes'
import type { LayoutType } from '@app/types/theme'
import ScrollToTop from '@/utils/ScrollToTop'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

const Views = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} className="w-full" />}>
            <ScrollToTop />
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views

