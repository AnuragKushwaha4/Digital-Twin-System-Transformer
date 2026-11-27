
import { useEffect, useState, useCallback } from "react";

import {
    getAllTransformers,
    getTransformerCondition
} from "../../Http/http";

import AddTransformer from "./AddTransformer";

// Generate random number within a range
const randomValue = (min, max, decimals = 2) => {
    return Number(
        (Math.random() * (max - min) + min).toFixed(decimals)
    );
};

// Extract voltage in volts from voltage class
const getVoltage = (voltageClass) => {
    const match = String(voltageClass).match(/[\d.]+/);

    if (!match) return 11000;

    const value = Number(match[0]);

    // Convert kV to V
    return String(voltageClass).toLowerCase().includes("kv")
        ? value * 1000
        : value;
};

// Generate simulated transformer readings
const generateReadings = (transformer) => {

    const specification = transformer.specification;

    const voltage = getVoltage(specification.voltageClass);

    const ratedCapacity = specification.ratedCapacity;

    // Calculate rated current
    const ratedCurrent = (
        ratedCapacity * 1000
    ) / (Math.sqrt(3) * voltage);

    // Generate current between 55% and 80% of rated current
    const averageCurrent = randomValue(
        ratedCurrent * 0.55,
        ratedCurrent * 0.80
    );

    const oilMin = specification.oilMarking.min;
    const oilMax = specification.oilMarking.max;

    return {
        temperature: {
            ambient: randomValue(25, 35),
            topOil: randomValue(45, 65),
            winding: randomValue(50, 75)
        },

        oil: {
            moisture: randomValue(10, 25),
            level: randomValue(oilMin, oilMax)
        },

        voltage: {
            lineToLine: randomValue(
                voltage * 0.98,
                voltage * 1.02
            )
        },

        current: {
            A: randomValue(
                averageCurrent * 0.98,
                averageCurrent * 1.02
            ),
            B: randomValue(
                averageCurrent * 0.98,
                averageCurrent * 1.02
            ),
            C: randomValue(
                averageCurrent * 0.98,
                averageCurrent * 1.02
            )
        }
    };
};


// Status color
const getStatusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "healthy":
        case "normal":
            return "bg-green-100 text-green-700";

        case "warning":
            return "bg-yellow-100 text-yellow-700";

        case "critical":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};


// Display individual condition metrics
function ConditionMetrics({ data }) {

    if (!data || typeof data !== "object") return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {Object.entries(data).map(([key, value]) => {

                if (
                    value &&
                    typeof value === "object" &&
                    !Array.isArray(value)
                ) {

                    // Nested condition object
                    if ("status" in value || "value" in value) {
                        return (
                            <div
                                key={key}
                                className="border border-gray-200 rounded-xl p-4"
                            >
                                <p className="text-sm text-gray-500 capitalize">
                                    {key.replace(/([A-Z])/g, " $1")}
                                </p>

                                <div className="flex items-center justify-between mt-2 gap-2">

                                    <span className="font-semibold text-gray-800">
                                        {value.value ?? "--"} {value.unit || ""}
                                    </span>

                                    {value.status && (
                                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(value.status)}`}>
                                            {value.status}
                                        </span>
                                    )}

                                </div>

                                {value.message && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        {value.message}
                                    </p>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={key}
                            className="col-span-full"
                        >
                            <h4 className="font-semibold text-gray-700 capitalize mb-2">
                                {key.replace(/([A-Z])/g, " $1")}
                            </h4>

                            <ConditionMetrics data={value} />
                        </div>
                    );
                }

                return (
                    <div
                        key={key}
                        className="border border-gray-200 rounded-xl p-4"
                    >
                        <p className="text-sm text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                        </p>

                        <p className="font-semibold text-gray-800 mt-2">
                            {String(value)}
                        </p>
                    </div>
                );
            })}

        </div>
    );
}


function TransformerDashboard() {

    const [transformers, setTransformers] = useState([]);
    const [selectedTransformer, setSelectedTransformer] = useState(null);

    const [condition, setCondition] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [loading, setLoading] = useState(true);
    const [conditionLoading, setConditionLoading] = useState(false);

    const [error, setError] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    // Fetch all transformers
    const fetchTransformers = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await getAllTransformers();

            const data = response.data.data || [];

            setTransformers(data);

            if (data.length > 0) {
                setSelectedTransformer(prev => {
                    return data.find(
                        item => item.transformerID === prev?.transformerID
                    ) || data[0];
                });
            } else {
                setSelectedTransformer(null);
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to fetch transformers"
            );
        } finally {
            setLoading(false);
        }
    };


    // Fetch current condition
    const fetchCondition = useCallback(async (transformer) => {

        if (!transformer) return;

        try {
            setConditionLoading(true);
            setError("");

            const readings = generateReadings(transformer);

            const response = await getTransformerCondition(
                transformer.transformerID,
                readings
            );

            if (response.data.success) {
                setCondition(response.data);
                setLastUpdated(new Date());
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to evaluate transformer condition"
            );
        } finally {
            setConditionLoading(false);
        }

    }, []);


    // Initial transformer fetch
    useEffect(() => {
        fetchTransformers();
    }, []);


    // Fetch condition immediately and then every hour
    useEffect(() => {

        if (!selectedTransformer) {
            setCondition(null);
            return;
        }

        setCondition(null);

        // First condition evaluation
        fetchCondition(selectedTransformer);

        // Repeat after every hour
        const interval = setInterval(() => {
            fetchCondition(selectedTransformer);
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);

    }, [selectedTransformer, fetchCondition]);


    // Handle newly added transformer
    const handleTransformerAdded = (newTransformer) => {

        setTransformers(prev => [...prev, newTransformer]);

        setSelectedTransformer(newTransformer);
        setCondition(null);
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 font-medium">
                    Loading transformers...
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-5 py-8">

                {/* Dashboard heading */}

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-7">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Transformer Monitoring
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Monitor and manage your transformer assets
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
                    >
                        + Add Transformer
                    </button>

                </div>


                {/* Error */}

                {error && (
                    <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
                        {error}
                    </div>
                )}


                {/* Transformer list */}

                <div className="mb-9">

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Registered Transformers
                        </h3>

                        <span className="text-sm text-gray-500">
                            {transformers.length} transformers
                        </span>
                    </div>

                    {transformers.length === 0 ? (

                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">

                            <h3 className="font-semibold text-gray-700">
                                No Transformers Found
                            </h3>

                            <p className="text-gray-500 text-sm mt-2">
                                Add your first transformer to start monitoring.
                            </p>

                        </div>

                    ) : (

                        <div className="flex gap-4 overflow-x-auto pb-4">

                            {transformers.map(transformer => {

                                const isSelected =
                                    selectedTransformer?.transformerID === transformer.transformerID;

                                return (
                                    <button
                                        key={transformer._id || transformer.transformerID}
                                        onClick={() => setSelectedTransformer(transformer)}
                                        className={`min-w-[270px] max-w-[270px] text-left bg-white border rounded-xl p-5 transition shadow-sm hover:shadow-md ${
                                            isSelected
                                                ? "border-blue-500 ring-2 ring-blue-100"
                                                : "border-gray-200"
                                        }`}
                                    >

                                        <div className="flex justify-between items-center mb-4">

                                            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg">
                                                <span className="text-xl">
                                                    ⚡
                                                </span>
                                            </div>

                                            {isSelected && (
                                                <span className="text-xs text-blue-600 font-semibold">
                                                    SELECTED
                                                </span>
                                            )}

                                        </div>

                                        <h4 className="font-bold text-gray-800">
                                            Transformer #{transformer.transformerID}
                                        </h4>

                                        <p className="text-sm text-gray-500 mt-2 truncate">
                                            {transformer.address}
                                        </p>

                                        <div className="border-t mt-4 pt-3 space-y-2">

                                            <p className="text-sm text-gray-600">
                                                Voltage:{" "}
                                                <span className="font-medium text-gray-800">
                                                    {transformer.specification.voltageClass}
                                                </span>
                                            </p>

                                            <p className="text-sm text-gray-600">
                                                Capacity:{" "}
                                                <span className="font-medium text-gray-800">
                                                    {transformer.specification.ratedCapacity} kVA
                                                </span>
                                            </p>

                                        </div>

                                    </button>
                                );
                            })}

                        </div>
                    )}

                </div>


                {/* Selected transformer details */}

                {selectedTransformer && (

                    <div className="space-y-7">

                        {/* Basic information */}

                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Transformer #{selectedTransformer.transformerID}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedTransformer.address}
                                    </p>
                                </div>

                                <span className="h-fit text-sm px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
                                    Transformer Details
                                </span>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                <DetailItem
                                    label="Transformer ID"
                                    value={selectedTransformer.transformerID}
                                />

                                <DetailItem
                                    label="Voltage Class"
                                    value={selectedTransformer.specification.voltageClass}
                                />

                                <DetailItem
                                    label="Rated Capacity"
                                    value={`${selectedTransformer.specification.ratedCapacity} kVA`}
                                />

                                <DetailItem
                                    label="Oil Marking"
                                    value={`${selectedTransformer.specification.oilMarking.min} - ${selectedTransformer.specification.oilMarking.max}`}
                                />

                            </div>

                        </section>


                        {/* Current condition */}

                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Current Condition
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Live condition evaluation using generated test readings
                                    </p>
                                </div>

                                <button
                                    onClick={() => fetchCondition(selectedTransformer)}
                                    disabled={conditionLoading}
                                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                                >
                                    {conditionLoading ? "Checking..." : "↻ Check Now"}
                                </button>

                            </div>


                            {conditionLoading && !condition ? (

                                <div className="py-12 text-center text-gray-500">
                                    Evaluating transformer condition...
                                </div>

                            ) : condition ? (

                                <div className="space-y-6">

                                    {/* Overall status */}

                                    <div className="bg-slate-50 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Overall Transformer Health
                                            </p>

                                            <h4 className="text-lg font-bold text-gray-800 mt-1">
                                                {condition.overallStatus?.toUpperCase()}
                                            </h4>
                                        </div>

                                        <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize w-fit ${getStatusColor(condition.overallStatus)}`}>
                                            {condition.overallStatus}
                                        </span>

                                    </div>


                                    {/* Temperature */}

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">
                                            Temperature Condition
                                        </h4>

                                        <ConditionMetrics
                                            data={condition.condition.temperature}
                                        />
                                    </div>


                                    {/* Oil */}

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">
                                            Oil Condition
                                        </h4>

                                        <ConditionMetrics
                                            data={condition.condition.oil}
                                        />
                                    </div>


                                    {/* Load */}

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">
                                            Load Condition
                                        </h4>

                                        <ConditionMetrics
                                            data={condition.condition.load}
                                        />
                                    </div>

                                    <div className="border-t pt-4 flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">

                                        <span>
                                            Last evaluated: {lastUpdated?.toLocaleString()}
                                        </span>

                                        <span>
                                            Automatic check interval: 1 hour
                                        </span>

                                    </div>

                                </div>

                            ) : (

                                <div className="py-12 text-center text-gray-500">
                                    No condition data available yet.
                                </div>

                            )}

                        </section>

                    </div>

                )}

            </div>


            {/* Add transformer modal */}

            {showAddForm && (
                <AddTransformer
                    onClose={() => setShowAddForm(false)}
                    onSuccess={handleTransformerAdded}
                />
            )}

        </div>
    );
}


// Reusable specification item
function DetailItem({ label, value }) {
    return (
        <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">
                {label}
            </p>

            <p className="font-semibold text-gray-800">
                {value}
            </p>
        </div>
    );
}

export default TransformerDashboard;
