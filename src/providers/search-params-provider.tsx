'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchParamsContextDispatch, SearchParamsContextState } from '@/contexts/search-params-context';
import { searchParamsInitialState, searchParamsReducer } from '@/reducers/search-params-reducer';
import { BuilderType, DisplayType } from '@/types/SearchParams';

interface SearchParamsProviderProps {
    children: React.ReactNode;
}

export const SearchParamsProvider = ({ children }: SearchParamsProviderProps) => {
    const searchParams = useSearchParams();
    const [state, dispatch] = React.useReducer(searchParamsReducer, {
        ...searchParamsInitialState,
        display: searchParams.get('display') as DisplayType,
        builder: searchParams.get('builder') as BuilderType,
        workflowUrl: searchParams.get('workflowUrl'),
        workflowName: searchParams.get('workflowName'),
    });

    return (
        <SearchParamsContextState.Provider value={state}>
            <SearchParamsContextDispatch.Provider value={dispatch}>{children}</SearchParamsContextDispatch.Provider>
        </SearchParamsContextState.Provider>
    );
};

SearchParamsProvider.displayName = 'SearchParamsProvider';
