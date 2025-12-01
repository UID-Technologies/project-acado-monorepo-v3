import React, { ReactNode } from 'react';

interface TableBodyProps {
    children: ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
    return <tbody>{children}</tbody>;
};
