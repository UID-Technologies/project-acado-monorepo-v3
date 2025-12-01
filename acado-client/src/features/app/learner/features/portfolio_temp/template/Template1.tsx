import React, { useState } from "react";
import { UserPortfolio } from '@app/types/learner/portfolio'


type portfolio = {
    portfolio: UserPortfolio
}

const Template1 = ({ portfolio: initialPortfolio }: portfolio) => {

    const [portfolio] = useState<UserPortfolio>(initialPortfolio);

    return (
        <div className="bg-gray-100 p-8 font-sans text-gray-800">
            {/* Header Section */}
            <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-black capitalize">
                        {portfolio?.name}
                    </h1>
                    <div className="text-blue-500 space-x-2">
                        {portfolio?.portfolio_social?.[0]?.linkedin && (
                            <a href={portfolio?.portfolio_social?.[0]?.linkedin} target="_blank" className="underline">LinkedIn</a>
                        )}
                        {portfolio?.portfolio_social?.[0]?.email && (
                            <a href={`mailto:${portfolio?.portfolio_social?.[0]?.email}`} target="_blank" className="underline">Email</a>
                        )}
                        {
                            portfolio?.portfolio_social?.[0]?.facebook && (
                                <a href={portfolio?.portfolio_social?.[0]?.facebook} target="_blank" className="underline">Github</a>
                            )
                        }
                    </div>
                </div>
                <div className="text-right">
                    <p>Email: {portfolio?.portfolio_social?.[0]?.email && (<span>{portfolio?.portfolio_social?.[0]?.email}</span>)}</p>
                    <p>Mobile:
                        {portfolio?.portfolio_social?.[0]?.mob_num && (
                            <span>{portfolio?.portfolio_social?.[0]?.mob_num}</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Education Section */}
            <div className="mb-2 border-b-2 border-black pb-4">
                <h5 className="text-center font-semibold pb-2 mb-1 dark:text-black">Education</h5>
                {
                    Array.isArray(portfolio.Education) && portfolio.Education.map((education, index) => (
                        <div key={index} className="flex justify-between mb-3">
                            <div>
                                <h5 className="font-semibold dark:text-black">{education.institute}</h5>
                                <p>{education.title}; GPA: {education.grade}</p>
                            </div>
                            <div className="text-right">
                                <p>{education.location}</p>
                                <p className="font-bold">{formatDate(education.start_date)} - {formatDate(education.end_date)}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Skills Summary Section */}
            <div className="mb-2 border-b-2 border-black pb-4">
                <h5 className="text-center font-semibold pb-2 mb-2 dark:text-black">Skills Summary</h5>
                <strong className="mr-2">Skill:</strong>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    {portfolio?.skill?.map((skill, index) => (
                        <li>
                            <span key={index}>{skill.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Work Experience Section */}
            <div className="mb-2 border-b-2 border-black pb-4">
                <h5 className="text-center font-semibold pb-2 dark:text-black">Work Experience</h5>
                {
                    Array.isArray(portfolio.Experience) && portfolio.Experience.map((experience, index) => (
                        <div key={index} className="flex justify-between mb-3">
                            <div>
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold dark:text-black">{experience.title}</h5>
                                    <div className="text-right">
                                        <p>{experience.location}</p>
                                        <p>{formatDate(experience.start_date)} - {formatDate(experience.end_date)}</p>
                                    </div>
                                </div>
                                <p>{experience.institute}</p>
                                <p>{formatDate(experience.start_date)} - {formatDate(experience.end_date)}</p>
                                <p className="list-disc list-inside space-y-1 mt-2">
                                    {experience.description}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Projects Section */}
            {/* <div className="mb-2 border-b-2 border-black pb-4">
                <h5 className="text-center font-semibold pb-2 dark:text-black">Projects</h5>
                <div>
                    <h3 className="font-semibold dark:text-black">Student Performance Prediction</h3>
                    <p>December 2023 - February 2024</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Achieved a 96% accuracy rate in forecasting student performance.</li>
                        <li>Managed missing values and categorical variables to improve data quality by 33%.</li>
                    </ul>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold dark:text-black">Credit Card Fraud Detection</h3>
                    <p>September 2023 - October 2023</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Developed a logistic regression-based model with 87% accuracy.</li>
                        <li>Minimized false positives by 16% through rigorous feature engineering.</li>
                    </ul>
                </div>
            </div> */}

            {/* Certificates Section */}
            <div className="mb-2 border-b-2 border-black pb-4">
                <h5 className="text-center font-semibold pb-2 dark:text-black">Certificates</h5>
                {
                    Array.isArray(portfolio.certificate) && portfolio.certificate.map((certificate, index) => (
                        <div key={index}>
                            <div className="mb-3">
                                <div className="flex justify-between items-center">
                                    <h5 className="font-semibold dark:text-black">{certificate.title}</h5>
                                    <p>{formatDate(certificate.start_date)} - {formatDate(certificate.end_date)}</p>
                                </div>
                                <p>{certificate.institute}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div >
    );
};

const formatDate = (dateString?: string) => {
    const date = new Date(`${dateString}-01`);
    const options = { year: 'numeric', month: 'short' } as Intl.DateTimeFormatOptions;
    return date.toLocaleDateString('en-US', options); // Outputs in format like "Dec 2023"
};


export default Template1;
