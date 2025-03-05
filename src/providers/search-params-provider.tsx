'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const sessionStorageDispatch = useSessionStorageDispatch();
    const router = useRouter();
    const display = (searchParams.get('display') as DisplayType) || 'graphviz';
    const builder = (searchParams.get('builder') as BuilderType) || 'form';
    const hideDialog = searchParams.get('hideDialog') === 'false';
    const workflowUrl = searchParams.get('workflowUrl') || '';
    const workflowName = searchParams.get('workflowName') || '';
    const [show, setShow] = React.useState(false);
    const [state, dispatch] = React.useReducer(searchParamsReducer, {
        ...searchParamsInitialState,
        display,
        builder,
        hideDialog,
        workflowUrl,
        workflowName,
    });

    React.useEffect(() => {
        if (searchParams.get('workflowUrl') && searchParams.get('hideDialog') === 'false') {
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
            dispatch({ type: 'SET_HIDE_DIALOG', payload: true });
            const query = new URLSearchParams({
                ...state,
                hideDialog: 'true',
                workflowName,
                workflowUrl,
            });
            router.replace(`${pathname}?${query.toString()}`);
            setShow(false);
        },
        [pathname, router, sessionStorageDispatch, state, workflowName, workflowUrl],
    );

    const handleClose = React.useCallback(
        (open: boolean) => {
            setShow(open);
            const query = new URLSearchParams({
                ...state,
                hideDialog: 'true',
            });
            router.replace(`${pathname}?${query.toString()}`);
        },
        [pathname, router, state],
    );

    return (
        <React.Fragment>
            <SearchParamsContextState.Provider value={state}>
                <SearchParamsContextDispatch.Provider value={dispatch}>{children}</SearchParamsContextDispatch.Provider>
            </SearchParamsContextState.Provider>
            <Dialog open={show} onOpenChange={handleClose}>
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
