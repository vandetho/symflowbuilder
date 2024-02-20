'use client';

import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { Edge, Node } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';

export const SessionStorageContext = React.createContext<{
    nodeConfig: Node<WorkflowPlace | WorkflowTransition>[];
    edgeConfig: Edge[];
    workflowConfig: WorkflowConfig | undefined;
    setNodeConfig: (config: Node<WorkflowPlace | WorkflowTransition>[]) => void;
    setEdgeConfig: (config: Edge[]) => void;
    setWorkflowConfig: (config: WorkflowConfig | undefined) => void;
}>({
    nodeConfig: [],
    edgeConfig: [],
    workflowConfig: undefined,
    setEdgeConfig: (_: Edge[]) => {},
    setNodeConfig: (_: Node<WorkflowPlace | WorkflowTransition>[]) => {},
    setWorkflowConfig: () => {},
});
