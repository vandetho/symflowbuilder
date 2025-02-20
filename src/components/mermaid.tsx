import React from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';
import { MermaidConfig } from 'mermaid';

const DEFAULT_CONFIG: MermaidConfig = {
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

interface MermaidProps {
    flowDefinition: string;
}

const Mermaid = React.memo<MermaidProps>(({ flowDefinition }) => {
    const { theme, systemTheme } = useTheme();

    mermaid.initialize({
        startOnLoad: true,
        ...DEFAULT_CONFIG,
        darkMode: theme === 'system' ? systemTheme === 'dark' : theme === 'dark',
    });

    React.useEffect(() => {
        mermaid.contentLoaded();
    }, []);

    return <div className="mermaid whitespace-pre-line p-5">{flowDefinition}</div>;
});

export default Mermaid;
