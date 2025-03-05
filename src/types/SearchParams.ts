export type SearchParamsContextStateType = {
    display: DisplayType;
    builder: BuilderType;
    hideDialog: boolean;
    workflowUrl: string;
    workflowName: string;
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
          type: 'SET_HIDE_DIALOG';
          payload: boolean;
      }
    | {
          type: 'SET_WORKFLOW_URL';
          payload: string;
      }
    | {
          type: 'SET_WORKFLOW_NAME';
          payload: string;
      }
    | {
          type: 'SET_SEARCH_PARAMS';
          payload: SearchParamsContextStateType;
      };

export type DisplayType = 'graphviz' | 'mermaid' | 'yaml';

export type BuilderType = 'form' | 'workflow';
