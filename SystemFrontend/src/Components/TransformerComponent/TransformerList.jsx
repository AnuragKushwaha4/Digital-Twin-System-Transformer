
import TransformerCard from "./TransformerCard";

function TransformerList({
    transformers,
    selectedTransformer,
    onSelect
}) {

    if (!transformers.length) {
        return (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">

                <h3 className="font-semibold text-gray-700">
                    No Transformers Found
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                    Add your first transformer to start monitoring.
                </p>

            </div>
        );
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">

            {transformers.map(transformer => (
                <TransformerCard
                    key={transformer._id || transformer.transformerID}
                    transformer={transformer}
                    selected={
                        selectedTransformer?.transformerID ===
                        transformer.transformerID
                    }
                    onClick={() => onSelect(transformer)}
                />
            ))}

        </div>
    );
}

export default TransformerList;
