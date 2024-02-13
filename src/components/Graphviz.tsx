'use client';

import React from 'react';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import dynamic from 'next/dynamic';

const GraphvizReact = dynamic(() => import('graphviz-react'), { ssr: false });

interface GraphvizProps {
    workflowConfig: WorkflowConfig;
}

const Graphviz = React.memo<GraphvizProps>(({}) => {
    const dot = 'digraph G { Hello->World }';

    return <GraphvizReact dot={dot} options={{ width: 200, height: 200 }} />;
});

export default Graphviz;
