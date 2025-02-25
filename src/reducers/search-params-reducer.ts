import { SearchParamsContextActionType, SearchParamsContextStateType } from '@/types/SearchParams';

export const searchParamsInitialState: SearchParamsContextStateType = {
    display: 'graphviz',
    builder: 'form',
    workflowUrl: null,
    workflowName: null,
};

export function searchParamsReducer(state: SearchParamsContextStateType, action: SearchParamsContextActionType) {
    switch (action.type) {
        case 'SET_DISPLAY':
            return { ...state, display: action.payload };
        case 'SET_BUILDER':
            return { ...state, builder: action.payload };
        default:
            return state;
    }
}
