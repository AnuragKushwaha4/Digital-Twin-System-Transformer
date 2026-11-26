
function GlobalErrorHandler(err, req, res, next) {

    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

    // MongoDB duplicate key error
    if (err.code === 11000) {
        status = 409;
        message = "Record already exists";
    }

    return res.status(status).json({
        success: false,
        status,
        message
    });
}

module.exports = GlobalErrorHandler;
