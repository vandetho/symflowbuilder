'use client';

import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { SessionStorageContext } from '@/contexts/session-storage-context';

type SessionStorageProvider = {};

const SessionStorageProvider = React.memo<React.PropsWithChildren<SessionStorageProvider>>(({ children }) => {
    const [workflowConfig, setWorkflowConfig] = React.useState<WorkflowConfig | undefined>(undefined);

    React.useEffect(() => {
        const config = sessionStorage.getItem('workflowConfig');
        if (config) {
            setWorkflowConfig(JSON.parse(config));
        }
    }, []);

    const handleWorkflowConfig = React.useCallback((config: WorkflowConfig) => {
        setWorkflowConfig(config);
        sessionStorage.setItem('workflowConfig', JSON.stringify(config));
    }, []);

    return (
        <SessionStorageContext.Provider value={{ workflowConfig, setWorkflowConfig: handleWorkflowConfig }}>
            {children}
        </SessionStorageContext.Provider>
    );
});

export default SessionStorageProvider;
