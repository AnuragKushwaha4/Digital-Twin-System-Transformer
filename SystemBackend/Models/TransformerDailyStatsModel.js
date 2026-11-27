const mongoose = require("mongoose");

const transformerDailyStatsSchema = new mongoose.Schema({

    transformer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transformer",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    // Number of readings collected during this day
    sampleCount: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },

    temperature: {
        ambient: {
            type: Number,
            required: true
        },
        topOil: {
            type: Number,
            required: true
        },
        winding: {
            type: Number,
            required: true
        }
    },

    load: {
        averageKVA: {
            type: Number,
            required: true,
            min: 0
        },
        averagePercentage: {
            type: Number,
            required: true,
            min: 0
        }
    },

    oil: {
        averageLevel: {
            type: Number,
            required: true
        },
        averageMoisture: {
            type: Number,
            required: true,
            min: 0
        }
    }

}, { timestamps: true });

transformerDailyStatsSchema.index(
    { transformer: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "TransformerDailyStats",
    transformerDailyStatsSchema
);