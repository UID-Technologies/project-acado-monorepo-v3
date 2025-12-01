import React from "react";
import appConfig from "@app/config/app.config";
import { logError } from "@/utils/errorLogger";
import { getErrors, clearErrors } from "@app/store/errorStore";
import { BiRightArrow } from "react-icons/bi";
import { RefreshCcw } from "lucide-react";
import cookiesStorage from "@services/storage/cookiesStorage";
// use notistack for toast notification
import { saveErrorLog } from "@services/logErrorService";

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {

    const [errors, setErrors] = React.useState<Error[]>([]);
    const [activeErrorTab, setActiveErrorTab] = React.useState<number>(-1);
    const [message, setMessage] = React.useState<string>("");

    React.useEffect(() => {
        const errors = getErrors();
        setErrors(errors);
    }, [error]);

    const reportThisError = () => {
        try {
            errors.forEach((error) => {
                saveErrorLog({
                    title: error.message,
                    errors: error.stack,
                    type: "error",
                    status: "500",
                }).then((response) => {
                    setMessage('Issue reported successfully');
                }).catch((error) => {
                    setMessage("Failed to report the issue");
                });
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="w-full">
            {appConfig.debug && <div className="flex justify-between items-center bg-red-500 p-4 text-white">
                <h1 className="text-2xl font-bold text-white">Error</h1>
                <div className="flex items-center gap-4">
                    <button onClick={resetErrorBoundary} className="px-4 py-2 bg-white text-red-500 rounded-lg flex items-center gap-2">
                        <RefreshCcw className="inline-block" size={20} /> Retry
                    </button>
                    {/* clear errors */}
                    <button onClick={() => { clearErrors(); setErrors([]); }} className="px-4 py-2 bg-white text-red-500 rounded-lg flex items-center gap-2">
                        <BiRightArrow className="inline-block" size={20} /> Clear
                    </button>
                    {/* clear all site data */}
                    <button onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                        cookiesStorage.clear();
                        sessionStorage.clear();
                    }} className="px-4 py-2 bg-white text-red-500 rounded-lg flex items-center gap-2">
                        <BiRightArrow className="inline-block" size={20} /> Clear All Site Data
                    </button>
                </div>
            </div>
            }
            {
                appConfig.debug && <div>
                    <div>
                        {
                            errors.length > 0 &&
                            <div className="grid grid-cols-1 md:grid-cols-12 h-[100vh]">
                                {/* error title */}
                                <div className="md:col-span-3 relative bg-gray-900">
                                    <ul className="space-y-2 p-4">
                                        {errors.map((error, index) => (
                                            <li onClick={() => setActiveErrorTab(index)}
                                                key={index} className={`p-4 hover:transform hover:scale-105 transition-transform duration-300 
                                        cursor-pointer rounded-lg ${activeErrorTab === index ? 'bg-red-500 text-white' : 'text-red-500 bg-gray-800'}
                                        `}>
                                                <BiRightArrow className="inline-block" /> {error.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="md:col-span-9 relative bg-gray-800">
                                    {/* show error stack according above click */}
                                    {
                                        activeErrorTab === -1 &&
                                        <div className="flex justify-center items-center h-full">
                                            <div>
                                                <img src="/img/errors/500.svg" alt="Error" className="w-96 h-96 dark:filter dark:invert dark:grayscale dark:contrast-50" />
                                                <h1 className="text-3xl font-bold text-gray-300">Select an error to view details</h1>
                                            </div>
                                        </div>
                                    }
                                    <div className="p-4 overflow-x-auto">
                                        {errors.map((error, index) => (
                                            <div key={index} className={activeErrorTab === index ? 'block' : 'hidden'}>
                                                <h1 className="text-red-500 text-2xl font-bold">{error.message}</h1>
                                                <pre className="text-white bg-gray-800 p-4 mt-4">
                                                    {error.stack}
                                                </pre>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    {/* when error 0 */}
                    {
                        errors.length === 0 &&
                        <div className="flex justify-center items-center h-[100vh] bg-gray-700">
                            <div className="text-center">
                                <img src="img/errors/500.svg" alt="Error" className="w-96 h-96 dark:filter dark:invert dark:grayscale dark:contrast-50" />
                                <h1 className="text-3xl font-bold text-gray-300">No errors found</h1>
                            </div>
                        </div>
                    }
                </div>
            }

            {
                !appConfig.debug && <div className="flex justify-center items-center bg-white dark:bg-gray-800 h-[100vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <img src="/img/errors/500.svg" alt="Error" className="w-96 h-96
                            dark:filter dark:invert dark:grayscale dark:contrast-50" />
                        <h1 className="text-3xl font-bold dark:text-gray-300">
                            {appConfig.errorMessages?.default}
                        </h1>
                        <div className="mt-6 space-x-4">
                            <button
                                onClick={() => window.location.href = "/"}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Go to Home
                            </button>
                            <button
                                onClick={reportThisError}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Report Issue
                            </button>
                        </div>
                        {
                            <div className="text-sm text-green-700 mt-4">
                                {message}
                            </div>
                        }
                    </div>
                </div>
            }

        </div >
    );
};

export default ErrorFallback;
