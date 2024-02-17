import React from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { downloadYaml } from '@/helpers/file.helper';

interface DownloadYamlProps {
    yaml: WorkflowConfigYaml | undefined;
}
export const DownloadYaml = React.memo<DownloadYamlProps>(({ yaml }) => {
    const handleExport = React.useCallback(() => {
        if (yaml) {
            downloadYaml(yaml);
        }
    }, [yaml]);

    return (
        <Button variant="secondary" className="z-10" onClick={handleExport}>
            Download YAML
        </Button>
    );
});
