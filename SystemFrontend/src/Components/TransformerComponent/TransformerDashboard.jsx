
import { useEffect, useState } from "react";

import { getAllTransformers } from "../../Http/http";

import TransformerList from "./TransformerList";
import TransformerDetails from "./TransformerDetails";
import AddTransformer from "./AddTransformer";

function TransformerDashboard() {

    const [transformers, setTransformers] = useState([]);
    const [selectedTransformer, setSelectedTransformer] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    // Fetch transformers
    useEffect(() => {

        const fetchTransformers = async () => {

            try {
                setLoading(true);
                setError("");

                const response = await getAllTransformers();

                const data = response.data.data || [];

                setTransformers(data);

                if (data.length > 0) {
                    setSelectedTransformer(data[0]);
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

        fetchTransformers();

    }, []);

    // Add newly created transformer
    const handleTransformerAdded = (newTransformer) => {

        setTransformers(prev => [
            ...prev,
            newTransformer
        ]);

        setSelectedTransformer(newTransformer);
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <p className="text-gray-500 font-medium">
                    Loading transformers...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-7xl mx-auto px-5 py-8">

                {/* Dashboard Header */}

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

                {/* Transformer List */}

                <section className="mb-9">

                    <div className="flex justify-between items-center mb-4">

                        <h3 className="text-lg font-semibold text-gray-800">
                            Registered Transformers
                        </h3>

                        <span className="text-sm text-gray-500">
                            {transformers.length} transformers
                        </span>

                    </div>

                    <TransformerList
                        transformers={transformers}
                        selectedTransformer={selectedTransformer}
                        onSelect={setSelectedTransformer}
                    />

                </section>

                {/* Selected Transformer */}

                {selectedTransformer ? (

                    <TransformerDetails
                        key={selectedTransformer.transformerID}
                        transformer={selectedTransformer}
                    />

                ) : (

                    <div className="bg-white rounded-xl border p-10 text-center text-gray-500">
                        Select a transformer or add a new one to get started.
                    </div>

                )}

            </div>

            {/* Add Transformer Modal */}

            {showAddForm && (
                <AddTransformer
                    onClose={() => setShowAddForm(false)}
                    onSuccess={handleTransformerAdded}
                />
            )}

        </div>
    );
}

export default TransformerDashboard;
