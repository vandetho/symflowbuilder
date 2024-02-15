import React from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';

interface ExportButtonProps {
    yaml: WorkflowConfigYaml | undefined;
}
export const ExportButton = React.memo<ExportButtonProps>(({ yaml }) => {
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
        <Button className="z-10" onClick={handleExport}>
            Export
        </Button>
    );
});
