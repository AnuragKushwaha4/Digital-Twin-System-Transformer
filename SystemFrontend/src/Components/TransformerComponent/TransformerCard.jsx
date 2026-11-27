
function TransformerCard({ transformer, onClick, selected }) {

    return (
        <button
            onClick={onClick}
            className={`min-w-67.5 max-w-67.5 text-left bg-white border rounded-xl p-5 transition shadow-sm hover:shadow-md ${
                selected
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-200"
            }`}
        >
            <div className="flex justify-between items-center mb-4">

                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg">
                    <span className="text-xl">⚡</span>
                </div>

                {selected && (
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
}

export default TransformerCard;
