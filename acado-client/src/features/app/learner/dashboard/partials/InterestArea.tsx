import React from "react";
import { useInterestAreaStore } from "@app/store/learner/interestAreaStore";
import { fetchInterestArea } from "@services/learner/InterestAreaServices";
import { BiRightArrow } from "react-icons/bi";
import { Link } from "react-router-dom";
const InterestArea: React.FC = () => {

    const { interestArea, setInterestArea, error, setError } = useInterestAreaStore();

    React.useEffect(() => {
        fetchInterestArea().then((data) => {
            console.log(data);
            setInterestArea(data);
        }).catch((error) => {
            setError(error);
        });
    }, [setInterestArea]);

    return (
        <div className='bg-gray-100 shadow-sm p-4 rounded-lg  dark:bg-gray-800 mt-4'>
            <h1 className='font-semibold capitalize text-lg mb-1 w-full block'>Your Interest</h1>
            <div className="w-full">
                {
                    interestArea.map((area, index) => {
                        if (area.is_mapped) {
                            return (
                                <div key={index} className='inline-block py-1 dark:text-gray-300 hover:dark:text-primary hover:text-primary cursor-pointer transform transition-transform hover:scale-[0.98]'>
                                    <Link to={'/interests'} className="flex justify-content items-center whitespace-nowrap">
                                        {/* <BiRightArrow /> */}
                                        <p>{area.name}</p>, &nbsp;
                                    </Link>
                                </div>)
                        }
                    })
                }
            </div>
        </div>
    )
}

export default InterestArea;
