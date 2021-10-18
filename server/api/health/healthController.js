// ==== Libraries used ====

// ==== Local Modules used ====


// ==== Controller methods ====

// ==== Basic health check ====
exports.basicCheck = async(req, res, next) => {
    try{
        let resObj = { 
            message: "Server is running and is healthy",
            envFileState: process.env.ENV_HEALTH
        }
        res.json(resObj)
    }catch(err){
        next(err)
    }
}

