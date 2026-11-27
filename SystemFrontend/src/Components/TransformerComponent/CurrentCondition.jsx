
import { useCallback, useEffect, useState } from "react";

import { getTransformerCondition } from "../../Http/http";

import { generateReadings } from "../../Utils/generateReadings";
import { getStatusColor } from "../../Utils/statusUtils";

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

                    if ("status" in value || "value" in value) {
                        return (
                            <div key={key} className="border rounded-xl p-4">

                                <p className="text-sm text-gray-500 capitalize">
                                    {key.replace(/([A-Z])/g, " $1")}
                                </p>

                                <div className="flex justify-between items-center mt-2 gap-2">

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
                        <div key={key} className="col-span-full">

                            <h4 className="font-semibold text-gray-700 capitalize mb-2">
                                {key.replace(/([A-Z])/g, " $1")}
                            </h4>

                            <ConditionMetrics data={value} />

                        </div>
                    );
                }

                return (
                    <div key={key} className="border rounded-xl p-4">

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

function CurrentCondition({ transformer }) {

    const [condition, setCondition] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCondition = useCallback(async () => {

        if (!transformer) return;

        try {
            setLoading(true);
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
            setLoading(false);
        }

    }, [transformer]);

    useEffect(() => {

        setCondition(null);
        setLastUpdated(null);

        fetchCondition();

        const interval = setInterval(() => {
            fetchCondition();
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);

    }, [fetchCondition]);

    return (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">

                <div>
                    <h3 className="text-xl font-bold text-gray-800">
                        Current Condition
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Latest transformer condition evaluation
                    </p>
                </div>

                <button
                    onClick={fetchCondition}
                    disabled={loading}
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                    {loading ? "Checking..." : "↻ Check Now"}
                </button>

            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            {loading && !condition ? (

                <div className="py-12 text-center text-gray-500">
                    Evaluating transformer condition...
                </div>

            ) : condition ? (

                <div className="space-y-6">

                    <div className="bg-slate-50 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">

                        <div>
                            <p className="text-sm text-gray-500">
                                Overall Transformer Health
                            </p>

                            <h4 className="text-lg font-bold text-gray-800 mt-1 capitalize">
                                {condition.overallStatus}
                            </h4>
                        </div>

                        <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize w-fit ${getStatusColor(condition.overallStatus)}`}>
                            {condition.overallStatus}
                        </span>

                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Temperature Condition
                        </h4>
                        <ConditionMetrics data={condition.condition.temperature} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Oil Condition
                        </h4>
                        <ConditionMetrics data={condition.condition.oil} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Load Condition
                        </h4>
                        <ConditionMetrics data={condition.condition.load} />
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
    );
}

export default CurrentCondition;
