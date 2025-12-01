import React, { ReactNode } from 'react';

interface TableHeadProps {
    children: ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ children }) => {
    return <thead className="text-[13px] text-gray-500/70">{children}</thead>;
};