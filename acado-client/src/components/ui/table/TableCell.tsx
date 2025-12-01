import React, { ReactNode } from 'react';

interface TableCellProps {
    children: ReactNode;
    className?: string;
    isHeader?: boolean;
    colspan?: number;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className, isHeader, colspan }) => {
    const Tag = isHeader ? 'th' : 'td';
    return (
        <Tag
            {
            ...colspan && !isHeader ? { colSpan: colspan } : {}
            }
            className={`${isHeader ? 'text-nowrap px-5 py-2 first:pl-3 last:pr-3 bg-gray-100 dark:bg-gray-700 first:rounded-l last:rounded-r last:pl-5 last:sticky last:right-0' : 'text-nowrap px-5 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b first:pl-3 last:pr-0 last:bg-gradient-to-r last:from-transparent last:to-white dark:last:to-gray-800 last:to-[12px] last:pl-5 last:sticky last:right-0'} ${className || ''
                }`}>
            {children}
        </Tag>
    );
};
