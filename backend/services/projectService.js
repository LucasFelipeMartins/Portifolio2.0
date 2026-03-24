const projectRepository = require('../repositories/projectRepository');

const listProjects = async () => {
    return projectRepository.findAll();
};

module.exports = {
    listProjects
};
