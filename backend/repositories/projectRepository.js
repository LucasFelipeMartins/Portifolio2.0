const Project = require('../models/projectModel');

const findAll = () => Project.find().sort({ createdAt: -1 });

module.exports = {
    findAll
};
