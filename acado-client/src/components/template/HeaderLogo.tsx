import Logo from '@/components/template/Logo'
import { useThemeStore } from '@app/store/themeStore'
import appConfig from '@app/config/app.config'
import { Link } from 'react-router-dom'
import type { Mode } from '@app/types/theme'

const HeaderLogo = ({ mode }: { mode?: Mode }) => {
    const defaultMode = useThemeStore((state) => state.mode)

    return (
        <Link to={appConfig.authenticatedEntryPath}>
            <Logo imgClass="max-h-10" mode={mode || defaultMode} className="hidden lg:block" />
        </Link>
    )
}

export default HeaderLogo
