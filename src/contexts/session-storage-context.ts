'use client';

import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { Edge, Node } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { SessionStorageActions, SessionStorageState } from '@/types/SessionStorage';

export const SessionStorageContextState = React.createContext<SessionStorageState>({
    nodeConfig: [],
    edgeConfig: [],
    workflowConfig: undefined,
});

export const SessionStorageContextDispatch = React.createContext<React.Dispatch<SessionStorageActions>>(() => {});
