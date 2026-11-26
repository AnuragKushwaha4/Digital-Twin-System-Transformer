
const TemperatureCache = {
    ambient: {
        healthy: {
            min: 0,
            max: 40
        },
        warning: {
            min: 40,
            max: 45
        },
        critical: {
            min: 45,
            max: Infinity
        }
    },

    topOil: {
        healthy: {
            max: 80
        },
        warning: {
            min: 80,
            max: 90
        },
        critical: {
            min: 90,
            max: Infinity
        }
    },

    winding: {
        healthy: {
            max: 100
        },
        warning: {
            min: 100,
            max: 110
        },
        critical: {
            min: 110,
            max: Infinity
        }
    }
};

module.exports = TemperatureCache;
