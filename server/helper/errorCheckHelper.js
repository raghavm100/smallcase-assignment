// ==== Libraries used ====

// ==== Local modules used ====

/*
    ====
    This module is responsible to 
    catch errors and format them
    when the Primary middlewares 
    throw an error. 

    This formatted error is then sent
    as an error response to client.
    ====
*/


module.exports = async (err, req, res, next) => {
    console.log(err)
    // ==== building error structure obj ====
    let errRes = {
        code: 404,
        messageList: []
    }

    // ==== Switch case to check the type of error ====
    switch(err.name){
        case "Error": {
            errRes.code = 400
            err.errors.map(errorValue => {
                errRes.messageList.push(errorValue.msg)
            })
        }break;

        default: {
            errRes.code = 500
            errRes.messageList.push("An unexpected error occured")
        }
    }   
    res.status(errRes.code).json(errRes)
}