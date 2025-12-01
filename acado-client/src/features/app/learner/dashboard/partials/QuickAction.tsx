import React from "react";
import { useQuickActionStore } from "@app/store/learner/quickActionStore";
import { fetchQuickAction } from "@services/learner/QuickActionService";
import { BiRightArrow } from "react-icons/bi";
import { Link } from "react-router-dom";
const QuickAction: React.FC = () => {

    const { quickActions, setQuickAction, error, setError } = useQuickActionStore();

    React.useEffect(() => {
        fetchQuickAction().then((data) => {
            console.log(data);
            setQuickAction(data);
        }).catch((error) => {
            setError(error);
        });
    }, [setQuickAction]);

    return (
        <>
            {
                Array.isArray(quickActions) && quickActions.length === 0 &&
                <div className='bg-white p-4 rounded-lg  dark:bg-gray-800 mt-4'>
                    <h1 className='font-semibold capitalize text-lg mb-1'>Quick Access</h1>
                    {
                        quickActions?.map((area, index) => (
                            area?.title && <Link to={area.action_url} key={index} className='flex items-center justify-start gap-3 py-1 dark:text-gray-300 hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                                <BiRightArrow />
                                <div className="w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <p >{area.title}</p>
                                        <p className='text-[9px] bg-primary rounded px-2 py-1 text-ac-dark'>{area.label}</p>
                                    </div>
                                    <p className='text-xs text-gray-500'>
                                        {area.message}
                                    </p>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            }
        </>
    )
}

export default QuickAction;
