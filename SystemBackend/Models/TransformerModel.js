
const mongoose = require("mongoose");

const transformerSchema = new mongoose.Schema({

    transformerID: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: "Transformer ID must be an integer"
        }
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    specification: {
        voltageClass: {
            type: String,
            required: true,
            enum: ["33 kV", "66 kV", "132 kV", "220 kV", "400 kV"]
        },

        oilMarking: {
            min: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                required: true
            }
        },

        ratedCapacity: {
            type: Number,
            required: true,
            min: 1
        }
    }

}, { timestamps: true });

module.exports = mongoose.model(
    "Transformer",
    transformerSchema
);
