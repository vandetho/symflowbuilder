'use client';

import React from 'react';
import { SessionStorageContextDispatch, SessionStorageContextState } from '@/contexts/session-storage-context';
import { sessionStorageInitialState, sessionStorageReducer } from '@/reducers/session-storage-reducer';

type SessionStorageProvider = {};

export const SessionStorageProvider = React.memo<React.PropsWithChildren<SessionStorageProvider>>(({ children }) => {
    const [state, dispatch] = React.useReducer(sessionStorageReducer, sessionStorageInitialState);

    React.useEffect(() => {
        const config = sessionStorage.getItem('workflowConfig');
        if (config) {
            dispatch({ type: 'SET_WORKFLOW_CONFIG', payload: JSON.parse(config) });
        }
    }, []);

    React.useEffect(() => {
        const config = sessionStorage.getItem('nodeConfig');
        if (config) {
            dispatch({ type: 'SET_NODE_CONFIG', payload: JSON.parse(config) });
        }
    }, []);

    React.useEffect(() => {
        const config = sessionStorage.getItem('edgeConfig');
        if (config) {
            dispatch({ type: 'SET_EDGE_CONFIG', payload: JSON.parse(config) });
        }
    }, []);

    return (
        <SessionStorageContextState.Provider value={state}>
            <SessionStorageContextDispatch.Provider value={dispatch}>{children}</SessionStorageContextDispatch.Provider>
        </SessionStorageContextState.Provider>
    );
});

SessionStorageProvider.displayName = 'SessionStorageProvider';
