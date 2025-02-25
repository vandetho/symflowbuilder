import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { generateToken } from '@/helpers/token.helper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mermaid } from '@/components/mermaid';

type ReactMermaidProps = {
    workflowConfig: WorkflowConfig | undefined;
};

export const ReactMermaid = React.memo<ReactMermaidProps>(({ workflowConfig }) => {
    const [direction, setDirection] = React.useState<'LR' | 'TD' | 'TB' | 'RL' | 'BT' | string>('LR');
    const [flowDefinition, setFlowDefinition] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        if (workflowConfig && direction) {
            let graphString = `graph ${direction}\n`;
            const places: { [key: string]: string } = {};
            workflowConfig.places.forEach((place) => {
                const placeName = `${place.name}_${generateToken()}`;
                places[place.name] = placeName;
                if (place.name === workflowConfig.initialMarking) {
                    graphString += `${placeName}([${place.name}])\n`;
                } else {
                    graphString += `${placeName}((${place.name}))\n`;
                }
                if (place.metadata) {
                    place.metadata.forEach((meta) => {
                        if (meta.name === 'bg_color') {
                            graphString += `style ${placeName} fill:${meta.value}\n`;
                        }
                    });
                }
            });
            const transitions: { [key: string]: string } = {};
            workflowConfig.transitions.forEach((transition) => {
                const transitionName = `${transition.name}_${generateToken()}`;
                transitions[transition.name] = transitionName;
                graphString += `${transitionName}[${transition.name}]\n`;
                transition.from.forEach((from) => {
                    graphString += `${places[from]} --> ${transitionName}\n`;
                });
                transition.to.forEach((to) => {
                    graphString += `${transitionName} --> ${places[to]}\n`;
                });
            });

            setFlowDefinition(graphString);
        }
    }, [direction, workflowConfig]);

    const handleDirection = React.useCallback((value: string) => {
        setDirection(value);
        setFlowDefinition(undefined);
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <Select onValueChange={handleDirection} value={direction}>
                <SelectTrigger>
                    <SelectValue placeholder="Select the direction" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="LR">Left to Right</SelectItem>
                    <SelectItem value="TD">Top Down</SelectItem>
                    <SelectItem value="TB">Top Bottom</SelectItem>
                    <SelectItem value="RL">Right to Left</SelectItem>
                    <SelectItem value="BT">Bottom Top</SelectItem>
                </SelectContent>
            </Select>
            {flowDefinition && <Mermaid flowDefinition={flowDefinition} />}
        </div>
    );
});

ReactMermaid.displayName = 'ReactMermaid';
