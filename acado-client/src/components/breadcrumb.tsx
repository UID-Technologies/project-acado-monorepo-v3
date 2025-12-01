import React from 'react'
import { Breadcrumb as ShadcnBreadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/shadcn/breadcrumb';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <ShadcnBreadcrumb className='mb-3'>
            <BreadcrumbList className='list-none'>
                <BreadcrumbItem>
                    <BreadcrumbLink to="/home">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {
                    items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.path ? (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink to={item.path}>{item.label}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            ) : (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </React.Fragment>
                    ))
                }
            </BreadcrumbList>
        </ShadcnBreadcrumb>
    )
}

export default Breadcrumb