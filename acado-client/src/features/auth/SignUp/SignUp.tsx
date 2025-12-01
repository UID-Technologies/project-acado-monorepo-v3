import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignUpForm from './components/SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@app/store/themeStore'
import { Link } from 'react-router-dom'
import { FaTimes } from "react-icons/fa";


type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useThemeStore(state => state.mode)

    return (
        <>
            {/* <div className="mb-8  flex justify-between">  
                <Link to="/">
                    <Logo mode={mode} imgClass="mx-auto" logoWidth={150} />
                </Link>
                <button className="p-2 text-red-500 hover:text-red-700 focus:outline-none">
                    <Link to="/" className="flex items-center ">
                        <FaTimes size={24} color="grey" />
                    </Link>
                    </button>
            </div> */}
            <div className="mb-4">
              
                <h3 className="mb-1">Sign Up</h3>
                <p className="font-semibold heading-text">
                    And lets get started with your free trial
                </p>
    
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignUpForm disableSubmit={disableSubmit} setMessage={setMessage} />
            <div>
                <div className="mt-4 text-center">
                    <span>Already have an account? </span>
                    <ActionLink
                        to={signInUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Sign in
                    </ActionLink>
                </div>
                <ActionLink
                  to='/terms-conditions'
                    className="font-bold text-primary justify-center items-center flex"
                >
                    Terms & Conditions
                </ActionLink>


            </div>
        </>
    )
}

const SignUp = () => {
    return <SignUpBase />
}

export default SignUp
