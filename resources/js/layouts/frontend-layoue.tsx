import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import Header from '@/components/frontend/Header';

interface FrontendLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: FrontendLayoutProps) => (
    <div className="min-h-screen bg-gray-50" {...props}>
        <Header />
        <main className=" mx-auto py-6 sm:px-6 lg:px-8">
            {children}
        </main>
    </div>
);
