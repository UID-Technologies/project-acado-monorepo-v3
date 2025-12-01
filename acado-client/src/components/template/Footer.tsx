import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@app/config/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@app/config/constants/theme.constant'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
    className?: string
}

const FooterContent = () => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between w-full text-center sm:text-left gap-2 sm:gap-0">
            <span className="text-sm">
                Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                <span className="font-semibold">{`${APP_NAME}`}</span> all
                rights reserved.
            </span>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-sm">
                <a
                    className="text-gray hover:underline"
                    href="/term-and-conditions"
                >
                    Terms & Conditions
                </a>
                <span className="mx-2 hidden sm:inline text-muted">|</span>
                <a className="text-gray hover:underline" href="/acado-privacy-policy">
                    Privacy Policy
                </a>
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
    className,
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`,
                className,
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
