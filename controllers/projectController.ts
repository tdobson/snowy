const Project = require('../models/project');
const { createImportEvent, createModificationEvent } = require('../utils/importUtils');

/**
 * Creates a new project and logs the creation as an import event.
 * @param {Object} req - The request object containing project data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the project is created.
 */
exports.createProject = async (req, res) => {
    try {
        // Assuming you have the user's ID from the request or session
        const userId = req.userId; //todo

        // Use the utility function to create an import event and get the importId
        const importId = await createImportEvent(req, userId);

        // Prepare project data
        const projectData = {
            ...req.body,
            importId: importId // Set the importId from the created import event
        };

        // Create the project with the importId
        const project = await Project.create(projectData);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Retrieves a project by its ID.
 * @param {Object} req - The request object containing the project ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the project is retrieved.
 */
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Updates an existing project and logs the update as a modification event.
 * @param {Object} req - The request object containing updated project data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the project is updated.
 */
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update the project with the new data
        await project.update(req.body);

        // Assuming you have the user's ID in req.userId
        // You can replace 'req.userId' with the appropriate variable as per your application's context
        const userId = req.userId;

        // Create a modification event
        const importId = await createModificationEvent(req, userId, project.importId);

        // Respond with the updated project and the importId of the modification event
        res.status(200).json({ project, importId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Deletes a project by its ID.
 * @param {Object} req - The request object containing the project ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the project is deleted.
 */
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.destroy();
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Retrieves all projects.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when all projects are retrieved.
 */
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
