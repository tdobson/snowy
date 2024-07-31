const sequelize = require('../config/sequelize');
const { createImportEvent, createModificationEvent } = require('../utils/importUtils');
const { Op } = require('sequelize');
/**
 * Retrieves all elevations in a Sheets compatible report.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when all elevations are retrieved.
 */
exports.getAllElevations = async (req, res) => {
    try {
        const elevations = await sequelize.query('SELECT * FROM sn_vw_plot_details_for_tracker', {
            type: sequelize.QueryTypes.SELECT,
        });
        res.status(200).json(elevations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Retrieves all elevations in a Sheets compatible report for a specific project.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when all elevations are retrieved.
 */
exports.getElevationsByProject = async (req, res) => {
    try {
        const { jobCode } = req.params;

        // Sanitize the jobCode parameter using Sequelize.escape()
        const sanitizedJobCode = Sequelize.escape(jobCode);

        const elevations = await sequelize.query(
            `SELECT * FROM sn_vw_plot_details_for_tracker WHERE \`Job Code\` = ${sanitizedJobCode}`,
            {
                type: sequelize.QueryTypes.SELECT,
            }
        );
        res.status(200).json(elevations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
