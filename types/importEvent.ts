import { Model, Optional } from 'sequelize';

export interface ImportEventAttributes {
    importId: string;
    instanceId: string;
    importDate: Date;
    importedBy: string;
    modifiedDate: Date;
    modifiedBy: string;
    modificationRef?: string;
    importRef?: string;
    importSource?: string;
    importNotes?: string;
}

export interface ImportEventCreationAttributes extends Optional<ImportEventAttributes, 'importId'> {}

export interface ImportEventInstance extends Model<ImportEventAttributes, ImportEventCreationAttributes>, ImportEventAttributes {}
