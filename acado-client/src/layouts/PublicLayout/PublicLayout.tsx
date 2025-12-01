import { useMemo, lazy } from 'react'
import type { CommonProps } from '@app/types/common'
import type { LazyExoticComponent } from 'react'

type LayoutType = 'simple'

type Layouts = Record<
    LayoutType,
    LazyExoticComponent<<T extends CommonProps>(props: T) => JSX.Element>
>

const currentLayoutType: LayoutType = 'simple'

const layouts: Layouts = {
    simple: lazy(() => import('./Simple')),
}

const PublicLayout = ({ children }: CommonProps) => {
    const Layout = useMemo(() => {
        return layouts[currentLayoutType]
    }, [])

    return <Layout>{children}</Layout>
}

export default PublicLayout
