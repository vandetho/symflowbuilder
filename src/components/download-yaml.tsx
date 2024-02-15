import React from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';

interface DownloadYamlProps {
    yaml: WorkflowConfigYaml | undefined;
}
export const DownloadYaml = React.memo<DownloadYamlProps>(({ yaml }) => {
    const handleExport = React.useCallback(() => {
        if (yaml) {
            axios.post('/api/workflows/exports', yaml).then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${Object.keys(yaml.framework.workflows)[0]}.yaml`);
                document.body.appendChild(link);
                link.click();
            });
        }
    }, [yaml]);

    return (
        <Button variant="secondary" className="z-10" onClick={handleExport}>
            Download YAML
        </Button>
    );
});
