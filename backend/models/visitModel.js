const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    eventId: { type: String, unique: true, sparse: true, index: true },
    ip: { type: String },
    device: { type: String },
    location: {
        city: { type: String },
        region: { type: String },
        country: { type: String }
    },
    pageVisited: { type: String },
    referrer: { type: String },
    metadata: {
        source: { type: String }
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', VisitSchema, 'visits');
