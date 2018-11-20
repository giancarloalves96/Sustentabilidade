const errors = require('restify-errors');
const Area = require('../models/Area');

module.exports = server => {
    // Get Areas
    server.get('/areas', async (req, res, next) => {
        try {
            const areas = await Area.find({});
            res.send(areas);
            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    // Get Single Area
    server.get('/areas/:id', async (req, res, next) => {
        try {
            const area = await Area.findById(req.params.id);
            res.send(area);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no are with the id of 
            ${req.params.id}`));
        }
    });

    // Add Area
    server.post('/areas', async (req, res, next) => {
        // Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const { zone_name, zone_type, location } = req.body;

        const area = new Area({
            zone_name,
            zone_type,
            location
        });

        try {
            const newArea = await area.save();
            res.send(201);
            next();
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }
    });

    // Update Area
    server.put('/areas/:id', async (req, res, next) => {
        // Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            const area = await Area.findOneAndUpdate({ _id: req.params.id }, req.body);
            res.send(200);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no area with the id of 
            ${req.params.id}`));
        }
    });

    // Delete Area
    server.del('/areas/:id', async (req, res, next) => {
        try {
            const area = await Area.findOneAndRemove({ _id: req.params.id });
            res.send(204);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no area with the id of 
            ${req.params.id}`));
        }
    });
};