import { Model, Optional } from 'sequelize';

import { Model, Optional } from 'sequelize';

export interface ProjectAttributes {
    projectId: string;
    clientId: string;
    instanceId: string;
    pvNumber: string;
    dnoDetailsId: string;
    regionId?: string;
    siteId?: string;
    refNumber?: string;
    projectName?: string;
    jobCode?: string;
    comments?: string;
    importId?: string;
    projectProcessId?: string;
    dnoZone?: string;
}

export interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'projectId'> {}

export interface ProjectInstance extends Model<ProjectAttributes, ProjectCreationAttributes>, ProjectAttributes {}

export { ProjectInstance as Project };
