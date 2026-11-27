
const TemperatureCache = require("../Cache/TemperatureCache");
const OilCache = require("../Cache/OilCache");


// Helper: create application errors
const createError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    return error;
};


// Helper: determine overall condition
const getOverallStatus = (statuses) => {
    if (statuses.includes("critical")) return "critical";
    if (statuses.includes("warning")) return "warning";
    return "healthy";
};


// 1. Temperature evaluation
exports.checkTemperature = (temperature) => {

    const results = {};

    const evaluate = (value, limits) => {

    if (!Number.isFinite(value)) {
        throw createError("Invalid temperature value");
    }

    // Ambient temperature
    if (limits.critical.max === Infinity &&
        limits.healthy.min !== undefined) {

        if (value < limits.healthy.min) {
            return {
                status: "warning",
                message: "Temperature is below the healthy range"
            };
        }

        if (value <= limits.healthy.max) {
            return {
                status: "healthy",
                message: "Temperature is within the healthy range"
            };
        }

        if (value <= limits.warning.max) {
            return {
                status: "warning",
                message: "Temperature is above the healthy range"
            };
        }

        return {
            status: "critical",
            message: "Temperature has exceeded the critical limit"
        };
    }

    if (value < limits.healthy.max) {
        return {
            status: "healthy",
            message: "Temperature is within the healthy range"
        };
    }

    if (value <= limits.warning.max) {
        return {
            status: "warning",
            message: "Temperature is in the warning range"
        };
    }

    return {
        status: "critical",
        message: "Temperature has exceeded the critical limit"
    };
};


    for (const parameter of ["ambient", "topOil", "winding"]) {

        if (temperature[parameter] === undefined) {
            throw createError(`Missing ${parameter} temperature`);
        }

        results[parameter] = {
            value: temperature[parameter],
            unit: "°C",
            ...evaluate(
                temperature[parameter],
                TemperatureCache[parameter]
            )
        };
    }

    return {
        status: getOverallStatus(
            Object.values(results).map(item => item.status)
        ),
        parameters: results
    };
};


// 2. Oil evaluation
exports.checkOil = (oil, transformer) => {

    const { moisture, level } = oil;

    if (!Number.isFinite(moisture) || moisture < 0) {
        throw createError("Invalid oil moisture value");
    }

    if (!Number.isFinite(level)) {
        throw createError("Invalid oil level value");
    }

    const voltageClass = transformer.specification.voltageClass;

    const moistureLimit = OilCache.moistureLimits[voltageClass];

    if (moistureLimit === undefined) {
        throw createError(
            `Moisture threshold not configured for ${voltageClass}`,
            422
        );
    }

    // Moisture evaluation
    const moistureResult = moisture <= moistureLimit
        ? {
            status: "healthy",
            message: "Oil moisture is within the recommended maximum limit"
        }
        : {
            status: "critical",
            message: "Oil moisture has exceeded the recommended maximum limit"
        };


    // Oil level evaluation using transformer specifications
    const { min, max } = transformer.specification.oilMarking;

    if (min >= max) {
        throw createError("Invalid oil level markings in transformer specifications");
    }

    let levelResult;

    if (level < min) {
        levelResult = {
            status: "critical",
            message: "Oil level is below the manufacturer's minimum marking"
        };
    }
    else if (level > max) {
        levelResult = {
            status: "warning",
            message: "Oil level is above the manufacturer's maximum marking"
        };
    }
    else {
        levelResult = {
            status: "healthy",
            message: "Oil level is within the manufacturer's markings"
        };
    }

    return {
        status: getOverallStatus([
            moistureResult.status,
            levelResult.status
        ]),

        moisture: {
            value: moisture,
            unit: "ppm",
            maximumAllowed: moistureLimit,
            ...moistureResult
        },

        level: {
            value: level,
            unit: "manufacturer indicator scale",
            minimum: min,
            maximum: max,
            ...levelResult
        }
    };
};


// 3. Load evaluation
exports.checkLoad = (apparentPowerKVA, transformer) => {

    if (
        !Number.isFinite(apparentPowerKVA) ||
        apparentPowerKVA < 0
    ) {
        throw createError("Invalid apparent power value");
    }

    const ratedCapacity = transformer.specification.ratedCapacity;

    if (!Number.isFinite(ratedCapacity) || ratedCapacity <= 0) {
        throw createError("Invalid transformer rated capacity");
    }

    const loadPercentage =
        (apparentPowerKVA / ratedCapacity) * 100;

    let status;
    let message;

    if (loadPercentage <= 80) {
        status = "healthy";
        message = "Transformer is operating within the normal load range";
    }
    else if (loadPercentage <= 100) {
        status = "warning";
        message = "Transformer is operating near its rated capacity";
    }
    else {
        status = "critical";
        message = "Transformer is overloaded";
    }

    return {
        status,
        apparentPowerKVA: Number(apparentPowerKVA.toFixed(2)),
        ratedCapacityKVA: ratedCapacity,
        loadPercentage: Number(loadPercentage.toFixed(2)),
        message
    };
};






const Transformer = require("../Models/TransformerModel");


// Add transformer
exports.addTransformer = async (transformerData) => {

    const existing = await Transformer.findOne({
        transformerID: transformerData.transformerID
    });

    if (existing) {
        throw createError("Transformer ID already exists", 409);
    }

    return await Transformer.create(transformerData);
};


// Update transformer
exports.updateTransformer = async (transformer, updateData) => {

    if (updateData.transformerID !== undefined &&
        updateData.transformerID !== transformer.transformerID) {
        throw createError("Transformer ID cannot be changed", 400);
    }

    const updatedTransformer = await Transformer.findByIdAndUpdate(
        transformer._id,
        {
            $set: {
                address: updateData.address,
                specification: updateData.specification
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return updatedTransformer;
};


// Delete transformer
exports.deleteTransformer = async (transformer, DailyStats) => {

    await DailyStats.deleteMany({
        transformer: transformer._id
    });

    await Transformer.findByIdAndDelete(transformer._id);

    return true;
};



// Calculate daily averages for transformer statistics

exports.calculateDailyAverages = (existingStats, readings) => {

    const count = existingStats?.sampleCount || 0;
    const nextCount = count + 1;

    // Round values to 2 decimal places
    const roundToTwo = (value) => Number(value.toFixed(2));

    const calculateAverage = (oldAverage, newValue) => {

        if (!Number.isFinite(newValue)) {
            throw createError("Invalid reading for daily average");
        }

        if (count === 0) {
            return roundToTwo(newValue);
        }

        if (!Number.isFinite(oldAverage)) {
            throw createError("Invalid existing daily average");
        }

        const average = (
            (oldAverage * count + newValue) / nextCount
        );

        return roundToTwo(average);
    };

    const oldTemperature = existingStats?.temperature || {};
    const oldOil = existingStats?.oil || {};
    const oldLoad = existingStats?.load || {};

    return {
        sampleCount: nextCount,

        temperature: {
            ambient: calculateAverage(
                oldTemperature.ambient,
                readings.temperature.ambient
            ),

            topOil: calculateAverage(
                oldTemperature.topOil,
                readings.temperature.topOil
            ),

            winding: calculateAverage(
                oldTemperature.winding,
                readings.temperature.winding
            )
        },

        oil: {
            averageLevel: calculateAverage(
                oldOil.averageLevel,
                readings.oil.level
            ),

            averageMoisture: calculateAverage(
                oldOil.averageMoisture,
                readings.oil.moisture
            )
        },

        load: {
            averageKVA: calculateAverage(
                oldLoad.averageKVA,
                readings.load.apparentPowerKVA
            ),

            averagePercentage: calculateAverage(
                oldLoad.averagePercentage,
                readings.load.loadPercentage
            )
        }
    };
};
