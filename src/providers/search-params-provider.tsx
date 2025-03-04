'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchParamsContextDispatch, SearchParamsContextState } from '@/contexts/search-params-context';
import { searchParamsInitialState, searchParamsReducer } from '@/reducers/search-params-reducer';
import { BuilderType, DisplayType } from '@/types/SearchParams';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UrlImportForm } from '@/components/form/url-import-form';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { useSessionStorageDispatch } from '@/hooks/session-storage-hook';

interface SearchParamsProviderProps {
    children: React.ReactNode;
}

export const SearchParamsProvider = ({ children }: SearchParamsProviderProps) => {
    const searchParams = useSearchParams();
    const sessionStorageDispatch = useSessionStorageDispatch();
    const [show, setShow] = React.useState(false);
    const [state, dispatch] = React.useReducer(searchParamsReducer, {
        ...searchParamsInitialState,
        display: (searchParams.get('display') as DisplayType) || 'graphviz',
        builder: (searchParams.get('builder') as BuilderType) || 'form',
        workflowUrl: searchParams.get('workflowUrl') || '',
        workflowName: searchParams.get('workflowName') || '',
    });

    React.useEffect(() => {
        dispatch({
            type: 'SET_SEARCH_PARAMS',
            payload: {
                display: (searchParams.get('display') as DisplayType) || 'graphviz',
                builder: (searchParams.get('builder') as BuilderType) || 'form',
                workflowUrl: searchParams.get('workflowUrl') || '',
                workflowName: searchParams.get('workflowName') || '',
            },
        });
    }, [searchParams]);

    React.useEffect(() => {
        if (searchParams.get('workflowUrl')) {
            setShow(true);
        }
    }, [searchParams]);

    const onChangeConfig = React.useCallback(
        ({
            config,
        }: {
            config: WorkflowConfig;
            yamlConfig?: WorkflowConfigYaml;
            workflowUrl?: string;
            workflowName?: string;
        }) => {
            sessionStorageDispatch({ type: 'SET_WORKFLOW_CONFIG', payload: config });
            setShow(false);
        },
        [sessionStorageDispatch],
    );

    return (
        <React.Fragment>
            <SearchParamsContextState.Provider value={state}>
                <SearchParamsContextDispatch.Provider value={dispatch}>{children}</SearchParamsContextDispatch.Provider>
            </SearchParamsContextState.Provider>
            <Dialog open={show} onOpenChange={setShow}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Workflow Configuration from URL</DialogTitle>
                        <DialogDescription>
                            Import a workflow configuration from a URL. The file must be a valid YAML file.
                        </DialogDescription>
                    </DialogHeader>
                    <UrlImportForm
                        workflowUrl={state.workflowUrl || ''}
                        workflowName={state.workflowName || ''}
                        buttonTitle="Import Workflow"
                        onValid={onChangeConfig}
                    />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

SearchParamsProvider.displayName = 'SearchParamsProvider';
