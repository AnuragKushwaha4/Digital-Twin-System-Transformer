
const express = require("express");
const router = express.Router();

const TransformerControllers = require("../Controllers/TransformerControllers");
const Authorized = require("../Middleware/Authorized");

// Add transformer
router.post(
    "/add",
    Authorized,
    TransformerControllers.addTransformer
);

// Evaluate current condition and save daily averages
router.post(
    "/:transformerID/condition",
    Authorized,
    TransformerControllers.getTransformerCondition
);



router.get(
    "/",
    Authorized,
    TransformerControllers.getAllTransformers
);


router.get(
    "/:transformerID/history",
    Authorized,
    TransformerControllers.getTransformerHistory
);


module.exports = router;
