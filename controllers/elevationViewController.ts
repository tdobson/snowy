import { Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { createImportEvent, createModificationEvent } from '../utils/importUtils';
import { Op, QueryTypes } from 'sequelize';

/**
 * Retrieves all elevations in a Sheets compatible report.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when all elevations are retrieved.
 */
export const getAllElevations = async (req: Request, res: Response): Promise<void> => {
    try {
        const elevations = await sequelize.query('SELECT * FROM sn_vw_plot_details_for_tracker', {
            type: QueryTypes.SELECT,
        });
        res.status(200).json(elevations);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

/**
 * Retrieves all elevations in a Sheets compatible report for a specific project.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when all elevations are retrieved.
 */
export const getElevationsByProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobCode } = req.params;

        // Sanitize the jobCode parameter using Sequelize.escape()
        const sanitizedJobCode = sequelize.escape(jobCode);

        const elevations = await sequelize.query(
            `SELECT * FROM sn_vw_plot_details_for_tracker WHERE \`Job Code\` = ${sanitizedJobCode}`,
            {
                type: QueryTypes.SELECT,
            }
        );
        res.status(200).json(elevations);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
