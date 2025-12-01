import React, { ReactNode } from 'react';

interface TableProps {
    children: ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
    return <div className={`overflow-x-auto ${className}`}><table className="table-auto w-full mt-3">{children}</table></div>;
};