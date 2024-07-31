import { Request } from 'express';
import { ImportEventInstance, ImportEventAttributes } from '../types/importEvent';
import { Model, ModelStatic } from 'sequelize';

const ImportEvent: ModelStatic<Model<ImportEventInstance, ImportEventAttributes>> = require('../models/importEvent');

/**
 * Creates a new import event in the database.
 *
 * This function is used to record a new import event, typically when a new project or other significant entity is created.
 * It captures details such as the date of import, the user who initiated the import, and any relevant notes or references.
 *
 * @param {Request} req - The Express request object containing the body with import details.
 * @param {string} userId - The ID of the user who is creating the import event.
 * @returns {Promise<string>} A promise that resolves with the importId of the newly created import event.
 * @throws {Error} Throws an error if there is an issue creating the import event.
 */
export const createImportEvent = async (req: Request, userId: string): Promise<string> => {
    try {
        const importEvent = await ImportEvent.create({
            importDate: new Date(),
            importedBy: userId,
            modifiedDate: new Date(),
            modifiedBy: userId,
            modificationRef: req.body.modificationRef || 'Default Modification Reference',
            importRef: req.body.importRef || 'Default Import Reference',
            importSource: 'Project Creation',
            importNotes: req.body.importNotes || 'No additional notes'
        });
        return importEvent.importId;
    } catch (error) {
        console.error('Error creating import event:', error);
        throw error;
    }
};

/**
 * Updates an existing import event to record a modification.
 *
 * This function is used when an existing entity (like a project) is modified, and the changes need to be recorded.
 * It finds an existing import event by its ID and updates it with new modification details such as the date of modification,
 * the user who made the modification, and any additional notes or references.
 *
 * @param {Request} req - The Express request object containing the body with modification details.
 * @param {string} userId - The ID of the user who is modifying the import event.
 * @param {string} importId - The ID of the import event that is being modified.
 * @returns {Promise<string>} A promise that resolves with the importId of the updated import event.
 * @throws {Error} Throws an error if the import event is not found or there is an issue updating it.
 */
export const createModificationEvent = async (req: Request, userId: string, importId: string): Promise<string> => {
    try {
        // Find the existing import event by importId
        const importEvent = await ImportEvent.findByPk(importId);
        if (!importEvent) {
            throw new Error('Import event not found');
        }

        // Update the import event with new modification details
        await importEvent.update({
            modifiedDate: new Date(),
            modifiedBy: userId,
            modificationRef: req.body.modificationRef || 'Default Modification Reference',
            importNotes: req.body.importNotes || 'Updated notes'
        });

        return importEvent.importId;
    } catch (error) {
        console.error('Error updating import event:', error);
        throw error;
    }
};
