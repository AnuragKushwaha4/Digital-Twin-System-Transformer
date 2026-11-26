

function GlobalErrorHandler(err,req,res,next){
    const status = err.status || 500

    return res.status(status).json({
        status : status,
        message : err.message
    })
}

module.exports = GlobalErrorHandler;