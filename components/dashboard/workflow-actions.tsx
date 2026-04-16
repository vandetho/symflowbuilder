"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DeleteWorkflowButton } from "./delete-workflow-button";
import { ShareWorkflowButton } from "./share-workflow-button";
import { WorkflowConfigBadge } from "./workflow-config-badge";
import { ExportWorkflowButton } from "./export-workflow-button";
import { CollaboratorsDialog } from "./collaborators-dialog";

interface WorkflowActionsProps {
    workflowId: string;
    workflowName: string;
    workflowType: string;
    symfonyVersion: string;
    shareId: string | null;
    graphJson: Record<string, unknown>;
}

export function WorkflowActions({
    workflowId,
    workflowName,
    workflowType,
    symfonyVersion,
    shareId,
    graphJson,
}: WorkflowActionsProps) {
    return (
        <div className="flex items-center gap-1 pt-1">
            <Tooltip>
                <TooltipTrigger>
                    <Link href={`/editor/${workflowId}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="w-3 h-3" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <ExportWorkflowButton name={workflowName} graphJson={graphJson} />
                </TooltipTrigger>
                <TooltipContent>Export YAML</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <WorkflowConfigBadge
                        name={workflowName}
                        type={workflowType}
                        symfonyVersion={symfonyVersion}
                        graphJson={graphJson}
                    />
                </TooltipTrigger>
                <TooltipContent>Config</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <CollaboratorsDialog
                        workflowId={workflowId}
                        workflowName={workflowName}
                    />
                </TooltipTrigger>
                <TooltipContent>Collaborators</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <ShareWorkflowButton workflowId={workflowId} shareId={shareId} />
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <DeleteWorkflowButton
                        workflowId={workflowId}
                        workflowName={workflowName}
                    />
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
            </Tooltip>
        </div>
    );
}
