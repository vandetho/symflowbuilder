'use client';

import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';

export const SessionStorageContext = React.createContext<{
    workflowConfig: WorkflowConfig | undefined;
    setWorkflowConfig: (config: WorkflowConfig) => void;
}>({
    workflowConfig: undefined,
    setWorkflowConfig: () => {},
});
