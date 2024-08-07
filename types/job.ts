import { Model, Optional } from 'sequelize';

export interface JobAttributes {
    jobId: string;
    plotId: string;
    instanceId: string;
    projectId: string;
    userId: string;
    slotId: string;
    jobStatus: string;
    dispatchId?: string;
    submissionId?: string;
    jobType?:string;
    dispatchedAt?: Date;
    dispatchedBy?: string;
    returnedAt?: Date;
    returnedBy?: string;
    dispatchTeam?: string;
    importId?: string;
}

export interface JobCreationAttributes extends Optional<JobAttributes, 'jobId'> {}

export interface JobInstance extends Model<JobAttributes, JobCreationAttributes>, JobAttributes {}
