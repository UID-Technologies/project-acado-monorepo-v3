import React, { ReactNode } from 'react';

interface TableRowProps {
    children: ReactNode;
    className?: string;
    isHeader?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className, isHeader }) => {
    return <tr className={`${isHeader ? 'hover:bg-gray-100 hover:dark:bg-gray-700 text-left' : 'hover:bg-gray-100 hover:dark:bg-gray-700'} ${className}`}>{children}</tr>;
};
