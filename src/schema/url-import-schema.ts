import { object, string } from 'yup';

export const urlImportSchema = object({
    workflowUrl: string().url().required(),
    workflowName: string().required(),
});
