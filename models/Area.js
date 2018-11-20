const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const PolygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    required: true
  },
  coordinates: {
    type: [[[Number]]],
    required: true
  }
});

const Colorado = {
  type: "Polygon",
  coordinates: [[[-109, 41], [-102, 41], [-102, 37], [-109, 37], [-109, 41]]]
};

const AreaSchema = new mongoose.Schema({
  zone_name: {
    type: String,
    required: true,
    trim: true
  },
  zone_type: {
    type: String,
    required: true
  },
  location: {
    type: PolygonSchema,
    default: Colorado
  }
});

AreaSchema.index({ location: "2dsphere" });
AreaSchema.plugin(timestamp);

const Area = mongoose.model("Area", AreaSchema);
module.exports = Area;
