import { Model, Optional } from 'sequelize';

export interface FormSubmissionAttributes {
    submissionId: string;
    dmSubmissionId: string;
    plotId: string;
    instanceId: string;
    jobId: string;
    importId?: string;
}

export interface FormSubmissionCreationAttributes extends Optional<FormSubmissionAttributes, 'submissionId'> {}

export interface FormSubmissionInstance extends Model<FormSubmissionAttributes, FormSubmissionCreationAttributes>, FormSubmissionAttributes {}
