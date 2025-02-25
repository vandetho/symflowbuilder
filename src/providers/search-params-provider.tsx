import React from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchParamsContextDispatch, SearchParamsContextState } from '@/contexts/search-params-context';
import { searchParamsInitialState, searchParamsReducer } from '@/reducers/search-params-reducer';

interface SearchParamsProviderProps {
    children: React.ReactNode;
}

export const SearchParamsProvider = ({ children }: SearchParamsProviderProps) => {
    const searchParams = useSearchParams();
    const [state, dispatch] = React.useReducer(searchParamsReducer, searchParamsInitialState);

    return (
        <SearchParamsContextState.Provider value={state}>
            <SearchParamsContextDispatch.Provider value={dispatch}>{children}</SearchParamsContextDispatch.Provider>
        </SearchParamsContextState.Provider>
    );
};
