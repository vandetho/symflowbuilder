export type SearchParamsContextStateType = {
    display: DisplayType;
    builder: BuilderType;
};

export type SearchParamsContextActionType =
    | {
          type: 'SET_DISPLAY';
          payload: DisplayType;
      }
    | {
          type: 'SET_BUILDER';
          payload: BuilderType;
      };

export type DisplayType = 'graphviz' | 'mermaid' | 'yaml';

export type BuilderType = 'form' | 'workflow';
