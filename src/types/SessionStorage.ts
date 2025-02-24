import { Edge, Node } from 'reactflow';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { WorkflowConfig } from '@/types/WorkflowConfig';

export type SessionStorageState = {
    nodeConfig: Node<WorkflowPlace | WorkflowTransition>[];
    workflowConfig: WorkflowConfig | undefined;
    edgeConfig: Edge[];
};

export type SessionStorageActions =
    | {
          type: 'SET_NODE_CONFIG';
          payload: Node<WorkflowPlace | WorkflowTransition>[];
      }
    | {
          type: 'SET_EDGE_CONFIG';
          payload: Edge[];
      }
    | {
          type: 'SET_WORKFLOW_CONFIG';
          payload: WorkflowConfig | undefined;
      };
