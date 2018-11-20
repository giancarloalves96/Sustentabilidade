const errors = require("restify-errors");
const Area = require("../models/Area");
const Machine = require("../models/Machine");

module.exports = server => {
  // Get Machines
  server.get("/machines", async (req, res, next) => {
    try {
      let machines = await Machine.find({});
      for (machine of machines) {
        let near = await Area.findOne()
          .where("location")
          .near({
            center: machine.location,
            maxDistance: 500,
            spherical: true
          });
        console.log("near", near);
        let inside = await Area.findOne()
          .where("location")
          .intersects()
          .geometry(machine.location);
        console.log("inside", inside);
        if (inside != null) {
          console.log("mudou pra 2");
          machine.color = 2;
        } else if (near != null) {
          console.log("mudou pra 1");
          machine.color = 1;
        } else {
          console.log("mudou pra 0");
          machine.color = 0;
        }
      }
      res.send(machines);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Get Single Machine
  server.get("/machines/:id", async (req, res, next) => {
    try {
      const machine = await Machine.findById(req.params.id);
      res.send(machine);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(`There is no machine with the id of 
            ${req.params.id}`)
      );
    }
  });

  // Add Machine
  server.post("/machines", async (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    const { company_name, id_in_company, location } = req.body;

    const machine = new Machine({
      company_name,
      id_in_company,
      location
    });

    try {
      const newMachine = await machine.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  // Update Machine
  server.put("/machines/:id", async (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      const machine = await Machine.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(`There is no machine with the id of 
            ${req.params.id}`)
      );
    }
  });

  // Delete Machine
  server.del("/machines/:id", async (req, res, next) => {
    try {
      const machine = await Area.findOneAndRemove({ _id: req.params.id });
      res.send(204);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(`There is no machine with the id of 
            ${req.params.id}`)
      );
    }
  });
};
