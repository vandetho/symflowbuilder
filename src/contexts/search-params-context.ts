import React from 'react';
import { SearchParamsContextActionType, SearchParamsContextStateType } from '@/types/SearchParams';

export const SearchParamsContextState = React.createContext<SearchParamsContextStateType | undefined>(undefined);

export const SearchParamsContextDispatch = React.createContext<React.Dispatch<SearchParamsContextActionType>>(() => {});
