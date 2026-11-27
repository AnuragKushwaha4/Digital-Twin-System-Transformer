
const config = require("./Configs/Config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const ConnectDB = require("./Configs/Connection");
const GlobalErrorHandler = require("./Middleware/ErrorHandler");

const AuthRoute = require("./Routes/AuthRoutes");
const TransformerRoute = require("./Routes/TransformerRoutes");

const app = express();

ConnectDB();

const PORT = config.port;

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "https://digital-twin-system-transformer.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use("/api/auth", AuthRoute);
app.use("/api/transformer", TransformerRoute);

app.get("/", (req, res) => {
    res.json({ message: "server started" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    return res.status(200).send("OK");
});

// Global error handler
app.use(GlobalErrorHandler);

app.listen(PORT, () => {
    console.log(`Started Server: ${PORT}`);
});
