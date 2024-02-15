import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { Metadata } from '@/types/Metadata';
import { WorkflowTransition } from '@/types/WorkflowTransition';

export class WorkflowConfigHelper {
    static toObject = (yamlConfig: WorkflowConfigYaml) => {
        const workflows = yamlConfig.framework.workflows;
        const workflowName = Object.keys(workflows)[0];
        const workflow = Object.values(workflows)[0];
        const workflowType = workflow.type;
        const places = workflow.places;
        const metadata = workflow.metadata;

        const workflowMetadata: Metadata[] = [];
        if (metadata) {
            Object.keys(metadata).forEach((key) => {
                workflowMetadata.push({ name: key, value: metadata[key] });
            });
        }

        const workflowPlaces: WorkflowPlace[] = Object.keys(places).map((key) => {
            const place = places[key];
            const workflowPlace: WorkflowPlace = { name: key };
            const metadata: Metadata[] = [];
            if (place && place.metadata) {
                const placeMetadata = place.metadata;
                Object.keys(place.metadata).forEach((meta) => {
                    metadata.push({ name: meta, value: placeMetadata[meta] });
                });
                workflowPlace.metadata = metadata;
            }
            return workflowPlace;
        });

        const transitions = workflow.transitions;
        const workflowTransitions: WorkflowTransition[] = [];
        if (transitions) {
            Object.keys(transitions).forEach((key) => {
                const transition = transitions[key];
                const from = transition.from;
                const to = transition.to;
                const metadata: Metadata[] = [];
                if (transition.metadata) {
                    const transitionMetadata = transition.metadata;
                    Object.keys(transition.metadata).forEach((meta) => {
                        metadata.push({ name: meta, value: transitionMetadata[meta] });
                    });
                }
                workflowTransitions.push({
                    name: key,
                    from: Array.isArray(from) ? from : [from],
                    to: Array.isArray(to) ? to : [to],
                    metadata,
                });
            });
        }

        const config: WorkflowConfig = {
            name: workflowName,
            type: workflowType,
            auditTrail: workflow.audit_trail.enabled,
            places: workflowPlaces,
            initialMarking: workflow.initial_marking,
            supports: workflow.supports.map((support) => ({ entityName: support })),
            metadata: workflowMetadata,
            markingStore: workflow.marking_store,
            events_to_dispatch: workflow.events_to_dispatch,
            transitions: workflowTransitions,
        };

        return config;
    };
}
