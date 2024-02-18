import { WorkflowConfigYaml } from '@/types/WorkflowConfigYaml';
import { WorkflowConfig } from '@/types/WorkflowConfig';
import { WorkflowPlace } from '@/types/WorkflowPlace';
import { Metadata } from '@/types/Metadata';
import { WorkflowTransition } from '@/types/WorkflowTransition';
import { WorkflowPlaceYaml } from '@/types/WorkflowPlaceYaml';
import { MetadataYaml } from '@/types/MetadataYaml';
import { WorkflowTransitionYaml } from '@/types/WorkflowTransitionYaml';

export class WorkflowConfigHelper {
    static toObject = (yamlConfig: WorkflowConfigYaml): WorkflowConfig => {
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

        return {
            name: workflowName,
            type: workflowType,
            auditTrail: workflow.audit_trail.enabled,
            places: workflowPlaces,
            initialMarking: workflow.initial_marking,
            supports: workflow.supports.map((support) => ({ entityName: support })),
            metadata: workflowMetadata,
            markingStore: workflow.marking_store,
            eventsToDispatch: workflow.events_to_dispatch,
            transitions: workflowTransitions,
        };
    };
    static toYaml = (config: WorkflowConfig): WorkflowConfigYaml => {
        const {
            name,
            metadata,
            eventsToDispatch,
            auditTrail,
            places,
            supports,
            transitions,
            initialMarking,
            markingStore,
            ...data
        } = config;
        const realPlaces: WorkflowPlaceYaml = {};
        places.forEach((place) => {
            const metadata: MetadataYaml = {};
            if (place.metadata && place.metadata.length > 0) {
                place.metadata.forEach((meta) => {
                    metadata[meta.name] = meta.value;
                });
            }
            realPlaces[place.name] = Object.keys(metadata).length > 0 ? { metadata } : null;
        });
        const realTransitions: WorkflowTransitionYaml | undefined = transitions.length > 0 ? {} : undefined;
        transitions.forEach((transition) => {
            const metadata: MetadataYaml = {};
            if (realTransitions) {
                realTransitions[transition.name] = {
                    from: transition.from,
                    to: transition.to,
                    guard: transition.guard,
                };
                if (transition.metadata && transition.metadata.length > 0) {
                    transition.metadata.forEach((meta) => {
                        metadata[meta.name] = meta.value;
                    });
                }
                realTransitions[transition.name].metadata = Object.keys(metadata).length > 0 ? metadata : undefined;
            }
        });
        const realMetadata: MetadataYaml = {};
        if (metadata && metadata.length > 0) {
            metadata.forEach((meta) => {
                realMetadata[meta.name] = meta.value;
            });
        }

        return {
            framework: {
                workflows: {
                    [name]: {
                        ...data,
                        metadata: Object.keys(realMetadata).length > 0 ? realMetadata : undefined,
                        audit_trail: { enabled: auditTrail },
                        supports: supports.map((support) => support.entityName),
                        marking_store: markingStore,
                        events_to_dispatch: eventsToDispatch,
                        initial_marking: initialMarking,
                        places: realPlaces,
                        transitions: realTransitions,
                    },
                },
            },
        };
    };
}
