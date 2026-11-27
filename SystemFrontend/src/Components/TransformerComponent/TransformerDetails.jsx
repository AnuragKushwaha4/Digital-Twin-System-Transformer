
import CurrentCondition from "./CurrentCondition";
import TransformerHistory from "./TransformerHistory";

function DetailItem({ label, value }) {
    return (
        <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">
                {label}
            </p>

            <p className="font-semibold text-gray-800">
                {value ?? "--"}
            </p>
        </div>
    );
}

function TransformerDetails({ transformer }) {

    if (!transformer) return null;

    const specification = transformer.specification;

    return (
        <div className="space-y-7">

            {/* Transformer Information */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Transformer #{transformer.transformerID}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {transformer.address}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <DetailItem
                        label="Transformer ID"
                        value={transformer.transformerID}
                    />

                    <DetailItem
                        label="Voltage Class"
                        value={specification.voltageClass}
                    />

                    <DetailItem
                        label="Rated Capacity"
                        value={`${specification.ratedCapacity} kVA`}
                    />

                    <DetailItem
                        label="Oil Marking"
                        value={`${specification.oilMarking.min} - ${specification.oilMarking.max}`}
                    />

                </div>

            </section>

            {/* Current Condition */}

            <CurrentCondition
                transformer={transformer}
            />

            {/* Daily History */}

            <TransformerHistory
                transformer={transformer}
            />

        </div>
    );
}

export default TransformerDetails;
