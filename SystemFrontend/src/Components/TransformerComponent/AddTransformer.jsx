
import { useState } from "react";
import { addTransformer } from "../../Http/http";

function AddTransformer({ onClose, onSuccess }) {

    const [formData, setFormData] = useState({
        transformerID: "",
        address: "",
        specification: {
            voltageClass: "",
            ratedCapacity: "",
            oilMarking: {
                min: "",
                max: ""
            }
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "transformerID" || name === "address") {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else if (name === "voltageClass" || name === "ratedCapacity") {
            setFormData(prev => ({
                ...prev,
                specification: {
                    ...prev.specification,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                specification: {
                    ...prev.specification,
                    oilMarking: {
                        ...prev.specification.oilMarking,
                        [name]: value
                    }
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        const payload = {
            transformerID: Number(formData.transformerID),
            address: formData.address.trim(),
            specification: {
                voltageClass: formData.specification.voltageClass,
                ratedCapacity: Number(formData.specification.ratedCapacity),
                oilMarking: {
                    min: Number(formData.specification.oilMarking.min),
                    max: Number(formData.specification.oilMarking.max)
                }
            }
        };

        try {
            const response = await addTransformer(payload);

            if (response.data.success) {
                onSuccess(response.data.data);
                onClose();
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to add transformer"
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    const voltageClasses = [
        "33 kV",
        "66 kV",
        "132 kV",
        "220 kV",
        "400 kV"
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center p-6 border-b">

                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Add New Transformer
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Enter transformer details and specifications
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 text-2xl"
                    >
                        &times;
                    </button>

                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Basic Information */}

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    Transformer ID
                                </label>

                                <input
                                    type="number"
                                    name="transformerID"
                                    value={formData.transformerID}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    step="1"
                                    className={inputClass}
                                    placeholder="Enter ID"
                                />
                            </div>

                            {/* Voltage Class Dropdown */}

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    Voltage Class
                                </label>

                                <select
                                    name="voltageClass"
                                    value={formData.specification.voltageClass}
                                    onChange={handleChange}
                                    required
                                    className={`${inputClass} bg-white`}
                                >
                                    <option value="" disabled>
                                        Select Voltage Class
                                    </option>

                                    {voltageClasses.map(voltage => (
                                        <option key={voltage} value={voltage}>
                                            {voltage}
                                        </option>
                                    ))}

                                </select>
                            </div>

                            {/* Address */}

                            <div className="md:col-span-2">
                                <label className="block text-sm mb-2 font-medium">
                                    Address / Location
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="Enter transformer location"
                                />
                            </div>

                            {/* Rated Capacity */}

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    Rated Capacity (kVA)
                                </label>

                                <input
                                    type="number"
                                    name="ratedCapacity"
                                    value={formData.specification.ratedCapacity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    step="1"
                                    className={inputClass}
                                    placeholder="e.g. 1000"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Oil Marking */}

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Oil Marking
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    Minimum Oil Level
                                </label>

                                <input
                                    type="number"
                                    name="min"
                                    value={formData.specification.oilMarking.min}
                                    onChange={handleChange}
                                    required
                                    step="any"
                                    className={inputClass}
                                    placeholder="Minimum"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">
                                    Maximum Oil Level
                                </label>

                                <input
                                    type="number"
                                    name="max"
                                    value={formData.specification.oilMarking.max}
                                    onChange={handleChange}
                                    required
                                    step="any"
                                    className={inputClass}
                                    placeholder="Maximum"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Actions */}

                    <div className="flex justify-end gap-3 pt-4 border-t">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Adding..." : "Add Transformer"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default AddTransformer;
