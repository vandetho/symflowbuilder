import React from 'react';
import { useSearchParams } from 'next/navigation';

interface SearchParamsProviderProps {
    children: React.ReactNode;
}

export const SearchParamsProvider = ({ children }: SearchParamsProviderProps) => {
    const searchParams = useSearchParams();
};
