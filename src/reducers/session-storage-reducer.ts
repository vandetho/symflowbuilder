import { SessionStorageActions, SessionStorageState } from '@/types/SessionStorage';

export const sessionStorageInitialState = {
    nodeConfig: [],
    workflowConfig: undefined,
    edgeConfig: [],
};

export const sessionStorageReducer = (state: SessionStorageState, action: SessionStorageActions) => {
    switch (action.type) {
        case 'SET_NODE_CONFIG':
            sessionStorage.setItem('nodeConfig', JSON.stringify(action.payload));
            return { ...state, nodeConfig: action.payload };
        case 'SET_EDGE_CONFIG':
            sessionStorage.setItem('edgeConfig', JSON.stringify(action.payload));
            return { ...state, edgeConfig: action.payload };
        case 'SET_WORKFLOW_CONFIG':
            if (action.payload) {
                sessionStorage.setItem('workflowConfig', JSON.stringify(action.payload));
            } else {
                sessionStorage.removeItem('workflowConfig');
            }
            return { ...state, workflowConfig: action.payload };
        default:
            return state;
    }
};
