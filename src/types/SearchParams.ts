export type SearchParamsContextStateType = {
    display: DisplayType;
    builder: BuilderType;
    workflowUrl: string | null | undefined;
    workflowName: string | null | undefined;
};

export type SearchParamsContextActionType =
    | {
          type: 'SET_DISPLAY';
          payload: DisplayType;
      }
    | {
          type: 'SET_BUILDER';
          payload: BuilderType;
      }
    | {
          type: 'SET_WORKFLOW_URL';
          payload: string | null;
      }
    | {
          type: 'SET_WORKFLOW_NAME';
          payload: string | null;
      }
    | {
          type: 'SET_SEARCH_PARAMS';
          payload: SearchParamsContextStateType;
      };

export type DisplayType = 'graphviz' | 'mermaid' | 'yaml';

export type BuilderType = 'form' | 'workflow';
