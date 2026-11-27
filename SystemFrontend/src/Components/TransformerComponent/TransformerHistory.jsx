
import { useEffect, useState } from "react";
import { getTransformerHistory } from "../../Http/http";

function HistoryMetric({ label, value, unit }) {
    return (
        <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
                {value ?? "--"} {unit || ""}
            </p>
        </div>
    );
}

function TransformerHistory({ transformer }) {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        let active = true;

        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getTransformerHistory(
                    transformer.transformerID
                );

                if (active) {
                    setHistory(response.data.data || []);
                }

            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to fetch transformer history"
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchHistory();

        return () => {
            active = false;
        };

    }, [transformer.transformerID]);

    if (loading) {
        return (
            <section className="bg-white rounded-2xl border p-6 text-center text-gray-500">
                Loading daily history...
            </section>
        );
    }

    return (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                    Daily History
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                    Daily average readings for Transformer #{transformer.transformerID}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {!error && history.length === 0 && (
                <div className="py-10 text-center">
                    <p className="font-semibold text-gray-700">
                        No history available
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                        Daily averages will appear here once monitoring records are saved.
                    </p>
                </div>
            )}

            <div className="space-y-4">

                {history.map((record) => (

                    <div
                        key={record._id}
                        className="border border-gray-200 rounded-xl p-5"
                    >

                        <div className="flex justify-between items-center mb-5">

                            <div>
                                <h4 className="font-semibold text-gray-800">
                                    {new Date(record.date).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            timeZone: "UTC"
                                        }
                                    )}
                                </h4>

                                <p className="text-xs text-gray-500 mt-1">
                                    Daily average readings
                                </p>
                            </div>

                            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-full">
                                Daily Average
                            </span>

                        </div>

                        {/* Temperature */}

                        <div className="mb-5">
                            <h5 className="font-medium text-gray-700 mb-3">
                                Temperature
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                                <HistoryMetric
                                    label="Ambient"
                                    value={record.temperature?.ambient}
                                    unit="°C"
                                />

                                <HistoryMetric
                                    label="Top Oil"
                                    value={record.temperature?.topOil}
                                    unit="°C"
                                />

                                <HistoryMetric
                                    label="Winding"
                                    value={record.temperature?.winding}
                                    unit="°C"
                                />

                            </div>
                        </div>

                        {/* Oil */}

                        <div className="mb-5">
                            <h5 className="font-medium text-gray-700 mb-3">
                                Oil Condition
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                <HistoryMetric
                                    label="Average Oil Level"
                                    value={record.oil?.averageLevel}
                                />

                                <HistoryMetric
                                    label="Average Moisture"
                                    value={record.oil?.averageMoisture}
                                    unit="ppm"
                                />

                            </div>
                        </div>

                        {/* Load */}

                        <div>
                            <h5 className="font-medium text-gray-700 mb-3">
                                Load Condition
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                <HistoryMetric
                                    label="Average Apparent Power"
                                    value={record.load?.averageKVA}
                                    unit="kVA"
                                />

                                <HistoryMetric
                                    label="Average Load"
                                    value={record.load?.averagePercentage}
                                    unit="%"
                                />

                            </div>
                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default TransformerHistory;
