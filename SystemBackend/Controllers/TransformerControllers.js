
const Transformer = require("../Models/TransformerModel");
const DailyStats = require("../Models/TransformerDailyStatsModel");

const TransformerServices = require("../Services/TransformerServices");


// Helper: find transformer
const getTransformer = async (transformerID) => {

    const transformer = await Transformer.findOne({
        transformerID: Number(transformerID)
    });

    if (!transformer) {
        const error = new Error("Transformer not found");
        error.status = 404;
        throw error;
    }

    return transformer;
};


// 1. Add Transformer
exports.addTransformer = async (req, res, next) => {
    try {

        const transformer = await TransformerServices.addTransformer(
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Transformer added successfully",
            data: transformer
        });

    } catch (error) {
        next(error);
    }
};


// 2. Get Current Transformer Condition
exports.getTransformerCondition = async (req, res, next) => {
    try {

        const { transformerID } = req.params;

        const {
            temperature,
            oil,
            voltage,
            current
        } = req.body;

        // Fetch transformer only once
        const transformer = await getTransformer(transformerID);

        // Validate electrical measurements
        if (
            !Number.isFinite(voltage?.lineToLine) ||
            voltage.lineToLine <= 0 ||
            !["A", "B", "C"].every(
                phase => Number.isFinite(current?.[phase]) &&
                         current[phase] >= 0
            )
        ) {
            const error = new Error("Invalid voltage or current readings");
            error.status = 400;
            throw error;
        }

        // Calculate average three-phase current
        const averageCurrent = (
            current.A + current.B + current.C
        ) / 3;

        // Three-phase apparent power
        const apparentPowerKVA = (
            Math.sqrt(3) *
            voltage.lineToLine *
            averageCurrent
        ) / 1000;


        // Evaluate temperature
        const temperatureResult =
            TransformerServices.checkTemperature(temperature);


        // Evaluate oil
        const oilResult =
            TransformerServices.checkOil(oil, transformer);


        // Evaluate load
        const loadResult =
            TransformerServices.checkLoad(
                apparentPowerKVA,
                transformer
            );


        // Calculate overall condition
        const overallStatus = [
            temperatureResult.status,
            oilResult.status,
            loadResult.status
        ].includes("critical")
            ? "critical"
            : [
                temperatureResult.status,
                oilResult.status,
                loadResult.status
            ].includes("warning")
                ? "warning"
                : "healthy";


        // Use UTC day boundaries consistently
        const now = new Date();
        const date = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
        ));


        // Fetch existing daily record once
        const existingStats = await DailyStats.findOne({
            transformer: transformer._id,
            date
        });


        // Calculate new daily averages
        const dailyAverages =
            TransformerServices.calculateDailyAverages(
                existingStats,
                {
                    temperature,
                    oil,
                    load: {
                        apparentPowerKVA,
                        loadPercentage: loadResult.loadPercentage
                    }
                }
            );


        // Save daily averages
        await DailyStats.findOneAndUpdate(
            {
                transformer: transformer._id,
                date
            },
            {
                $set: {
                    ...dailyAverages,
                    transformer: transformer._id,
                    date
                }
            },
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );


        return res.status(200).json({
            success: true,
            message: "Transformer condition evaluated successfully",

            transformer: {
                transformerID: transformer.transformerID,
                voltageClass: transformer.specification.voltageClass
            },

            overallStatus,

            condition: {
                temperature: temperatureResult,
                oil: oilResult,
                load: loadResult
            },

            dailyAverages
        });

    } catch (error) {
        next(error);
    }
};


// 3. Update Transformer
exports.updateTransformer = async (req, res, next) => {
    try {

        const transformer = await getTransformer(
            req.params.transformerID
        );

        const updatedTransformer =
            await TransformerServices.updateTransformer(
                transformer,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Transformer updated successfully",
            data: updatedTransformer
        });

    } catch (error) {
        next(error);
    }
};


// 4. Delete Transformer
exports.deleteTransformer = async (req, res, next) => {
    try {

        const transformer = await getTransformer(
            req.params.transformerID
        );

        await TransformerServices.deleteTransformer(
            transformer,
            DailyStats
        );

        return res.status(200).json({
            success: true,
            message: "Transformer and its monitoring history deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};
