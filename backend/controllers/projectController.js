const projectService = require('../services/projectService');

const getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.listProjects();
        console.info(`[Projects] ${projects.length} registros enviados para ${req.ip} às ${new Date().toISOString()}`);
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects
};
