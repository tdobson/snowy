import { Request, Response } from 'express';
import Project from '../models/project';
import { ProjectAttributes } from '../types/project';
import { createImportEvent, createModificationEvent } from '../utils/importUtils';

/**
 * Creates a new project and logs the creation as an import event.
 * @param {Request} req - The request object containing project data.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the project is created.
 */
export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        // Assuming you have the user's ID from the request or session
        const userId = (req as any).userId; // TODO: Implement proper user authentication

        // Use the utility function to create an import event and get the importId
        const importId = await createImportEvent(req, userId, 'project');

        // Prepare project data
        const projectData = {
            ...req.body,
            importId: importId // Set the importId from the created import event
        };

        // Create the project with the importId
        const project = await Project.create(projectData);
        res.status(201).json(project);
    } catch (error: any) {
        res.status(400).json({ error: (error as Error).message || 'An error occurred while creating the project' });
    }
};

/**
 * Retrieves a project by its ID.
 * @param {Request} req - The request object containing the project ID.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the project is retrieved.
 */
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

/**
 * Updates an existing project and logs the update as a modification event.
 * @param {Request} req - The request object containing updated project data.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the project is updated.
 */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update the project with the new data
        await project.update(req.body);

        // Assuming you have the user's ID in req.userId
        // You can replace 'req.userId' with the appropriate variable as per your application's context
        const userId = (req as any).userId; // TODO: Implement proper user authentication

        // Create a modification event
        const importId = await createModificationEvent(req, userId, project.importId || '');

        // Respond with the updated project and the importId of the modification event
        res.status(200).json({ project, importId });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

/**
 * Deletes a project by its ID.
 * @param {Request} req - The request object containing the project ID.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the project is deleted.
 */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.destroy();
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

/**
 * Retrieves all projects.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when all projects are retrieved.
 */
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects = await Project.findAll();
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
