
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

// One daily record per transformer
transformerDailyStatsSchema.index(
    { transformer: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "TransformerDailyStats",
    transformerDailyStatsSchema
);
