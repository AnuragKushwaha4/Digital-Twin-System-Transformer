
const randomValue = (min, max, decimals = 2) => {
    return Number(
        (Math.random() * (max - min) + min).toFixed(decimals)
    );
};

const getVoltage = (voltageClass) => {
    const match = String(voltageClass).match(/[\d.]+/);

    if (!match) return 11000;

    const value = Number(match[0]);

    return String(voltageClass).toLowerCase().includes("kv")
        ? value * 1000
        : value;
};

export const generateReadings = (transformer) => {

    const specification = transformer.specification;

    const voltage = getVoltage(specification.voltageClass);

    const ratedCapacity = specification.ratedCapacity;

    const ratedCurrent =
        (ratedCapacity * 1000) / (Math.sqrt(3) * voltage);

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
            A: randomValue(averageCurrent * 0.98, averageCurrent * 1.02),
            B: randomValue(averageCurrent * 0.98, averageCurrent * 1.02),
            C: randomValue(averageCurrent * 0.98, averageCurrent * 1.02)
        }
    };
};
