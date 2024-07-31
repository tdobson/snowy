const { Project, Client, DnoDetail, Site, Region } = require('../models');

exports.getMCSReport = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                { model: Client, attributes: ['name'] },
                { model: DnoDetail, attributes: ['dno_name'] },
                { model: Site, attributes: ['site_name'] },
                { model: Region, attributes: ['region_name'] }
            ],
            attributes: ['project_id', 'pv_number', 'ref_number']
        });
        res.json(projects);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getMCSReportById = async (req, res) => {
    const { project_id } = req.params;

    try {
        const project = await Project.findByPk(project_id, {
            include: [
                { model: Client, attributes: ['name'] },
                { model: DnoDetail, attributes: ['dno_name'] },
                { model: Site, attributes: ['site_name'] },
                { model: Region, attributes: ['region_name'] }
            ],
            attributes: ['project_id', 'pv_number', 'ref_number']
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).send(error.message);
    }
};