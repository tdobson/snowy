import { Request, Response } from 'express';
import { Project, Client, DnoDetail, Site, Region } from '../models';

export const getMCSReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects = await Project.findAll({
            include: [
                { model: Client, attributes: ['clientName'] },
                { model: DnoDetail, attributes: ['dnoName'] },
                { model: Site, attributes: ['siteName'] },
                { model: Region, attributes: ['regionName'] }
            ],
            attributes: ['projectId', 'pvNumber', 'refNumber']
        });
        res.json(projects);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};

export const getMCSReportById = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;

    try {
        const project = await Project.findByPk(projectId, {
            include: [
                { model: Client, attributes: ['clientName'] },
                { model: DnoDetail, attributes: ['dnoName'] },
                { model: Site, attributes: ['siteName'] },
                { model: Region, attributes: ['regionName'] }
            ],
            attributes: ['projectId', 'pvNumber', 'refNumber']
        });

        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        res.json(project);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};
