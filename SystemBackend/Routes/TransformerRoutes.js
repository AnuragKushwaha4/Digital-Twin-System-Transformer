
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

// Update transformer specifications
router.put(
    "/:transformerID",
    Authorized,
    TransformerControllers.updateTransformer
);

// Delete transformer and its history
router.delete(
    "/:transformerID",
    Authorized,
    TransformerControllers.deleteTransformer
);

router.get(
    "/",
    Authorized,
    TransformerControllers.getAllTransformers
);

module.exports = router;
