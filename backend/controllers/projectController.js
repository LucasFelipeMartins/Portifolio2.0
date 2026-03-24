const projectService = require('../services/projectService');

const getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.listProjects();
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects
};
