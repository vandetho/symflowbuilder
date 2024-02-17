import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import jsYaml from 'js-yaml';
export const downloadYaml = (yaml: WorkflowConfigYaml) => {
    const blob = new Blob([jsYaml.dump(yaml)], { type: 'application/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${Object.keys(yaml.framework.workflows)[0]}.yaml`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
