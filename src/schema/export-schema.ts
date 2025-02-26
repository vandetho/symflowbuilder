import { array, boolean, object, string } from 'yup';

const nameRegex = /^[a-zA-Z0-9_\-\s]+$/i;
const entityNameRegex = /^[a-zA-Z0-9\\]+$/i;

const nameRegexLabel = '[a-zA-Z0-9_\\-\\s]';
const entityNameRegexLabel = '[a-zA-Z0-9\\\\]';

export const exportSchema = object({
    name: string()
        .matches(nameRegex, { message: `Workflow name must match the following: ${nameRegexLabel}` })
        .required(),
    metadata: array(
        object({
            name: string()
                .matches(nameRegex, { message: `Metadata name must match the following: ${nameRegexLabel}` })
                .required(),
            value: string().required(),
        }),
    ),
    auditTrail: boolean().required(),
    markingStore: object({
        type: string().required(),
        property: string().required(),
    }).required(),
    type: string().required(),
    supports: array(
        object({
            entityName: string()
                .matches(entityNameRegex, {
                    message: `Support entity name must match the following: ${entityNameRegexLabel}`,
                })
                .required(),
        }),
    ).required(),
    initialMarking: string().required(),
});
