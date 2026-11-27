
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



exports.getAllTransformers = async (req, res, next) => {
    try {
        const transformers = await Transformer.find().sort({
            transformerID: 1
        });

        return res.status(200).json({
            success: true,
            count: transformers.length,
            data: transformers
        });

    } catch (error) {
        next(error);
    }
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



exports.getTransformerCondition = async (req, res, next) => {
    try {
        const { transformerID } = req.params;

        const {
            temperature,
            oil,
            voltage,
            current
        } = req.body;

        // 1. Fetch transformer
        const transformer = await getTransformer(transformerID);

        // 2. Validate temperature readings
        if (
            !temperature ||
            !["ambient", "topOil", "winding"].every(
                key => Number.isFinite(temperature[key])
            )
        ) {
            const error = new Error("Invalid temperature readings");
            error.status = 400;
            throw error;
        }

        // 3. Validate oil readings
        if (
            !oil ||
            !Number.isFinite(oil.moisture) ||
            !Number.isFinite(oil.level)
        ) {
            const error = new Error("Invalid oil readings");
            error.status = 400;
            throw error;
        }

        // 4. Validate voltage and current
        if (
            !Number.isFinite(voltage?.lineToLine) ||
            voltage.lineToLine <= 0 ||
            !["A", "B", "C"].every(
                phase =>
                    Number.isFinite(current?.[phase]) &&
                    current[phase] >= 0
            )
        ) {
            const error = new Error("Invalid voltage or current readings");
            error.status = 400;
            throw error;
        }

        // 5. Calculate average three-phase current
        const averageCurrent = (
            current.A + current.B + current.C
        ) / 3;

        // 6. Calculate apparent power in kVA
        const apparentPowerKVA = (
            Math.sqrt(3) *
            voltage.lineToLine *
            averageCurrent
        ) / 1000;

        // 7. Calculate load percentage
        const ratedCapacity = Number(
            transformer.specification.ratedCapacity
        );

        if (
            !Number.isFinite(ratedCapacity) ||
            ratedCapacity <= 0
        ) {
            throw new Error("Invalid transformer rated capacity");
        }


        // 8. Evaluate temperature
        const temperatureResult =
            TransformerServices.checkTemperature(temperature);

        // 9. Evaluate oil
        const oilResult =
            TransformerServices.checkOil(oil, transformer);

        // 10. Evaluate load
        const loadResult =
            TransformerServices.checkLoad(
                apparentPowerKVA,
                transformer
            );

        // 11. Calculate overall condition
        const statuses = [
            temperatureResult.status,
            oilResult.status,
            loadResult.status
        ];

        const overallStatus = statuses.includes("critical")
            ? "critical"
            : statuses.includes("warning")
                ? "warning"
                : "healthy";

        // 12. Get UTC day start
        const now = new Date();

        const date = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
        ));

        // 13. Fetch existing daily statistics
        const existingStats = await DailyStats.findOne({
            transformer: transformer._id,
            date
        });

        // 14. Calculate updated daily averages
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

        // 15. Validate daily averages before saving
        const requiredValues = [
            dailyAverages?.temperature?.ambient,
            dailyAverages?.temperature?.topOil,
            dailyAverages?.temperature?.winding,
            dailyAverages?.load?.averageKVA,
            dailyAverages?.load?.averagePercentage,
            dailyAverages?.oil?.averageLevel,
            dailyAverages?.oil?.averageMoisture
        ];

        if (!requiredValues.every(Number.isFinite)) {
            console.error("Invalid daily averages:", dailyAverages);

            const error = new Error(
                "Unable to calculate valid daily averages"
            );

            error.status = 500;
            throw error;
        }

        // 16. Save daily averages
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

        // 17. Return current condition
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
            }
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



exports.getTransformerHistory = async (req, res, next) => {
    try {
        const { transformerID } = req.params;

        const transformer = await getTransformer(transformerID);

        const history = await DailyStats.find({
            transformer: transformer._id
        })
        .sort({ date: -1 })
        .lean();

        return res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });

    } catch (error) {
        next(error);
    }
};
