import React from 'react';
import { SearchParamsContextDispatch, SearchParamsContextState } from '@/contexts/search-params-context';

export const useSearchParamsState = () => {
    const context = React.useContext(SearchParamsContextState);
    if (context === undefined) {
        throw new Error('useSearchParamsState must be used within a SearchParamsContextStateProvider');
    }
    return context;
};

export const useSearchParamsDispatch = () => {
    const context = React.useContext(SearchParamsContextDispatch);
    if (context === undefined) {
        throw new Error('useSearchParamsDispatch must be used within a SearchParamsContextDispatchProvider');
    }
    return context;
};
