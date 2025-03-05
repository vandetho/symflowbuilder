import { SearchParamsContextActionType, SearchParamsContextStateType } from '@/types/SearchParams';

export const searchParamsInitialState: SearchParamsContextStateType = {
    display: 'graphviz',
    builder: 'form',
    hideDialog: true,
    workflowUrl: '',
    workflowName: '',
};

export function searchParamsReducer(state: SearchParamsContextStateType, action: SearchParamsContextActionType) {
    switch (action.type) {
        case 'SET_DISPLAY':
            return { ...state, display: action.payload };
        case 'SET_BUILDER':
            return { ...state, builder: action.payload };
        case 'SET_HIDE_DIALOG':
            return { ...state, hideDialog: action.payload };
        case 'SET_WORKFLOW_URL':
            return { ...state, workflowUrl: action.payload };
        case 'SET_WORKFLOW_NAME':
            return { ...state, workflowName: action.payload };
        case 'SET_SEARCH_PARAMS':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
