import React from 'react';
import appConfig from '@app/config/app.config';

interface ErrorProps {
    error?: string;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error ?? appConfig?.errorMessages?.default}</span>
        </div>
    );
};

export default Error;