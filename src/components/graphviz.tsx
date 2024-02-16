'use client';

import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import dynamic from 'next/dynamic';
import { generateToken } from '@/helpers/token.helper';

const GraphvizReact = dynamic(() => import('graphviz-react'), { ssr: false });

interface GraphvizProps {
    workflowConfig: WorkflowConfig | undefined;
}

const Graphviz = React.memo<GraphvizProps>(({ workflowConfig }) => {
    if (workflowConfig) {
        let dot =
            `digraph ${workflowConfig.name} { \n` +
            '  ratio="compress" rankdir="LR"\n' +
            '  node [fontsize="9" fontname="Inter" color="#333333" fillcolor="lightblue" fixedsize="false" width="1"];\n' +
            '  edge [fontsize="9" fontname="Inter" color="#333333" arrowhead="normal" arrowsize="0.5"];\n';
        const places: { [key: string]: string } = {};
        const transitions: { [key: string]: string } = {};

        workflowConfig.places.forEach((place) => {
            const token = generateToken({ size: 16 });
            const placeName = `${place.name}_${token}`;
            const bgColor = place.metadata?.find((meta) => meta.name === 'bg_color');
            let fillColor: string | undefined = undefined;
            if (bgColor) {
                fillColor = bgColor.value;
            }
            if (place.name === workflowConfig.initialMarking) {
                dot += `  ${placeName} [shape="circle" label="${place.name}" style="filled"];\n`;
            } else {
                dot += `  ${placeName} [shape="circle" label="${place.name}" ${fillColor ? ` style="filled" fillcolor="${fillColor}"` : ''}];\n`;
            }
            places[place.name] = placeName;
        });
        workflowConfig.transitions.forEach((transition) => {
            const token = generateToken({ size: 16 });
            const transitionName = `${transition.name}_${token}`;
            dot += `  ${transitionName} [shape="box" label="${transition.name}"];\n`;
            transitions[transition.name] = transitionName;
        });
        workflowConfig.transitions.forEach((transition) => {
            transition.from.forEach((from) => {
                dot += `  ${places[from]} -> ${transitions[transition.name]};\n`;
            });
            transition.to.forEach((to) => {
                dot += `  ${transitions[transition.name]} -> ${places[to]};\n`;
            });
        });
        dot += '}';

        return (
            <div className="relative">
                <div className="w-[875px] border fixed">
                    <GraphvizReact dot={dot} options={{ fit: false, zoom: true, width: 875, height: 560 }} />
                </div>
            </div>
        );
    }
    return undefined;
});

export default Graphviz;
