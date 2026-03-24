const Visit = require('../models/visitModel');

const create = (payload) => Visit.create(payload);

module.exports = {
    create
};
