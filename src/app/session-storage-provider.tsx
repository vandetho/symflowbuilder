'use client';

import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { SessionStorageContext } from '@/contexts/session-storage-context';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { Edge, Node } from 'reactflow';

type SessionStorageProvider = {};

const SessionStorageProvider = React.memo<React.PropsWithChildren<SessionStorageProvider>>(({ children }) => {
    const [workflowConfig, setWorkflowConfig] = React.useState<WorkflowConfig | undefined>(undefined);
    const [nodeConfig, setNodeConfig] = React.useState<Node<WorkflowPlace | WorkflowTransition>[]>([]);
    const [edgeConfig, setEdgeConfig] = React.useState<Edge[]>([]);

    React.useEffect(() => {
        const config = sessionStorage.getItem('workflowConfig');
        if (config) {
            setWorkflowConfig(JSON.parse(config));
        }
    }, []);

    React.useEffect(() => {
        const config = sessionStorage.getItem('nodeConfig');
        if (config) {
            setNodeConfig(JSON.parse(config));
        }
    }, []);

    React.useEffect(() => {
        const config = sessionStorage.getItem('edgeConfig');
        if (config) {
            setEdgeConfig(JSON.parse(config));
        }
    }, []);

    const handleWorkflowConfig = React.useCallback((config: WorkflowConfig | undefined) => {
        setWorkflowConfig(config);
        if (config) {
            sessionStorage.setItem('workflowConfig', JSON.stringify(config));
            return;
        }
        sessionStorage.removeItem('workflowConfig');
    }, []);

    const handleNodeConfig = React.useCallback((config: Node<WorkflowPlace | WorkflowTransition>[]) => {
        setNodeConfig(config);
        sessionStorage.setItem('nodeConfig', JSON.stringify(config));
    }, []);

    const handleEdgeConfig = React.useCallback((config: Edge[]) => {
        setEdgeConfig(config);
        sessionStorage.setItem('edgeConfig', JSON.stringify(config));
    }, []);

    return (
        <SessionStorageContext.Provider
            value={{
                nodeConfig,
                edgeConfig,
                workflowConfig,
                setWorkflowConfig: handleWorkflowConfig,
                setEdgeConfig: handleEdgeConfig,
                setNodeConfig: handleNodeConfig,
            }}
        >
            {children}
        </SessionStorageContext.Provider>
    );
});

export default SessionStorageProvider;
