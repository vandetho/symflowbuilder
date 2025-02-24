import React from 'react';
import { SessionStorageContextDispatch, SessionStorageContextState } from '@/contexts/session-storage-context';

export const useSessionStorageState = () => {
    const context = React.useContext(SessionStorageContextState);
    if (context === undefined) {
        throw new Error('useSessionStorageState must be used within a SessionStorageProvider');
    }
    return context;
};

export const useSessionStorageDispatch = () => {
    const context = React.useContext(SessionStorageContextDispatch);
    if (context === undefined) {
        throw new Error('useSessionStorageDispatch must be used within a SessionStorageProvider');
    }
    return context;
};
