const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const PolygonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
    },
    coordinates: {
        type: [[[Number]]],
        required: true
    }
});

const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const Colorado = {
    type: 'Polygon',
    coordinates: [[
        [-109, 41],
        [-102, 41],
        [-102, 37],
        [-109, 37],
        [-109, 41]
    ]]
};

const Denver = {
    type: 'Point',
    coordinates: [-104.9903, 39.7392]
};

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: PolygonSchema,
        default: Colorado
    }
});

CustomerSchema.plugin(timestamp);

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;