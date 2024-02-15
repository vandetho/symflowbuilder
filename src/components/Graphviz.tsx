'use client';

import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import dynamic from 'next/dynamic';
import { ExportButton } from '@/components/export-button';
import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';

const GraphvizReact = dynamic(() => import('graphviz-react'), { ssr: false });

interface GraphvizProps {
    workflowConfig: WorkflowConfig | undefined;
    workflowConfigYaml: WorkflowConfigYaml | undefined;
}

const Graphviz = React.memo<GraphvizProps>(({ workflowConfig, workflowConfigYaml }) => {
    if (workflowConfig) {
        let dot =
            'digraph workflow { \n' +
            '  ratio="compress" rankdir="LR"\n' +
            '  node [fontsize="9" fontname="Inter" color="#333333" fillcolor="lightblue" fixedsize="false" width="1"];\n' +
            '  edge [fontsize="9" fontname="Inter" color="#333333" arrowhead="normal" arrowsize="0.5"];\n';
        workflowConfig.places.forEach((place) => {
            const bgColor = place.metadata?.find((meta) => meta.name === 'bg_color');
            let fillColor: string | undefined = undefined;
            if (bgColor) {
                fillColor = bgColor.value;
            }
            if (place.name === workflowConfig.initialMarking) {
                dot += `  ${place.name} [shape="circle" label="${place.name}" style="filled"];\n`;
            } else {
                dot += `  ${place.name} [shape="circle" label="${place.name}" ${fillColor ? ` style="filled" fillcolor="${fillColor}"` : ''}];\n`;
            }
        });
        workflowConfig.transitions.forEach((transition) => {
            dot += `  ${transition.name} [shape="box" label="${transition.name}"];\n`;
        });
        workflowConfig.transitions.forEach((transition) => {
            transition.from.forEach((from) => {
                dot += `  ${from} -> ${transition.name};\n`;
            });
            transition.to.forEach((to) => {
                dot += `  ${transition.name} -> ${to};\n`;
            });
        });
        dot += '}';

        return (
            <div className="relative">
                <div className="w-[875px] border fixed">
                    <GraphvizReact dot={dot} options={{ fit: false, zoom: true, width: 875, height: 560 }} />
                    <ExportButton yaml={workflowConfigYaml} />
                </div>
            </div>
        );
    }
    return undefined;
});

export default Graphviz;
