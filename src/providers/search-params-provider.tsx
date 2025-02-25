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
    const [state, dispatch] = React.useReducer(searchParamsReducer, searchParamsInitialState);

    React.useEffect(() => {
        const display = searchParams.get('display');
        const builder = searchParams.get('builder');
        if (display) {
            dispatch({ type: 'SET_DISPLAY', payload: display as DisplayType });
        }
        if (builder) {
            dispatch({ type: 'SET_BUILDER', payload: builder as BuilderType });
        }
    }, [searchParams]);

    return (
        <SearchParamsContextState.Provider value={state}>
            <SearchParamsContextDispatch.Provider value={dispatch}>{children}</SearchParamsContextDispatch.Provider>
        </SearchParamsContextState.Provider>
    );
};

SearchParamsProvider.displayName = 'SearchParamsProvider';
