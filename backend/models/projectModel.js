const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String },
    tags: [{ type: String }],
    category: { type: String },
    status: { type: String },
    repo_url: { type: String },
    live_url: { type: String }
}, { timestamps: true });

const collectionName = process.env.PROJECTS_COLLECTION || 'Projects';

module.exports = mongoose.model('Project', ProjectSchema, collectionName);
