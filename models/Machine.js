const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const PointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  { _id: false }
);

const Denver = {
  type: "Point",
  coordinates: [-104.9903, 39.7392]
};

const MachineSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
    trim: true
  },
  id_in_company: {
    type: Number,
    required: true
  },
  location: {
    type: PointSchema,
    default: Denver
  },
  color: {
    type: Number,
    default: 0
  }
});

MachineSchema.index({ location: "2dsphere" });
MachineSchema.plugin(timestamp);

const Machine = mongoose.model("Machine", MachineSchema);
module.exports = Machine;
