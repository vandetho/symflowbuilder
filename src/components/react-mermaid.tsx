import React from 'react';
import mermaid from 'mermaid';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { generateToken } from '@/helpers/token.helper';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEFAULT_CONFIG = {
    theme: 'dark',
    logLevel: 'fatal',
    fontFamily: 'Inter',
    securityLevel: 'strict',
    arrowMarkerAbsolute: false,
    flowchart: {
        htmlLabels: true,
        curve: 'linear',
    },
    sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1,
        useMaxWidth: true,
        rightAngles: false,
        showSequenceNumbers: false,
    },
    gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        barGap: 4,
        topPadding: 50,
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        numberSectionStyles: 4,
        axisFormat: '%Y-%m-%d',
    },
};

type ReactMermaidProps = {
    workflowConfig: WorkflowConfig | undefined;
};

const ReactMermaid = React.memo<ReactMermaidProps>(({ workflowConfig }) => {
    const { theme, systemTheme } = useTheme();
    const [direction, setDirection] = React.useState<'LR' | 'TD' | 'TB' | 'RL' | 'BT' | string>('LR');
    mermaid.initialize({
        startOnLoad: true,
        ...DEFAULT_CONFIG,
        darkMode: theme === 'system' ? systemTheme === 'dark' : theme === 'dark',
    });

    React.useEffect(() => {
        if (workflowConfig) {
            mermaid.contentLoaded();
        }
    }, [workflowConfig, systemTheme]);

    const flowDefinition = React.useMemo<string | undefined>(() => {
        if (workflowConfig) {
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

            return graphString;
        }
        return undefined;
    }, [direction, workflowConfig]);

    if (!flowDefinition) return null;

    return (
        <div className="flex flex-col gap-3">
            <Select onValueChange={setDirection} value={direction}>
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
            <div className="mermaid whitespace-pre-line p-5">{flowDefinition}</div>
        </div>
    );
});

export default ReactMermaid;
