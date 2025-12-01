import { cloneElement } from 'react'
import Container from '@/components/shared/Container'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@app/types/common'
import authBanner from '@/assets/images/auth/auth.png'
import { Link } from 'react-router-dom'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@app/store/themeStore'
import { FaTimes } from "react-icons/fa";

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {

    const mode = useThemeStore(state => state.mode)

    return (
        <div className="bg-white dark:bg-gray-800 h-full min-h-[110vh] px-5 md:px-0">
            <Container>
                <div className="flex items-center justify-between px-5 py-5 rounded-lg">
                    <Link to="/" className="flex items-center">
                        <Logo mode={mode} imgClass="mx-auto" logoWidth={150} />
                    </Link>
                    <ul className="flex items-center space-x-4">
                        <li>
                            <Link to="/" className="text-gray-300  hover:text-primary">Home</Link>
                        </li>
                    </ul>
                </div>
                <div className='grid md:grid-cols-2 gap-12 justify-center items-center h-[80vh]'>
                    <div className='hidden md:flex col-span-1 justify-center items-center'>
                        <img src={authBanner} alt='auth-bg' className='w-full h-full object-contain' />
                    </div>
                    <div className="flex justify-center items-center col-span-1 w-full">
                        <div className="w-full max-w-md px-8">
                            {content}
                            {children
                                ? cloneElement(children as ReactElement, {
                                    contentClassName: 'text-center',
                                    ...rest,
                                })
                                : null}
                        </div>
                    </div>
                </div>
            </Container>
        </div >
    )
}

export default Simple
