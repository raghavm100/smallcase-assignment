// ==== Libraries used ====
var {body, param, query} = require('express-validator')

// ==== Local modules used ====
var EnumCollection = require('../../utils/enumCollection')



// ==== Validating Buy Assets ====
exports.checkBuyAsset = [
    body("ticker")
        .exists().withMessage("ticker parameter is missing.")
        .bail()
        .isAlphanumeric().withMessage("Ticker can only be a string")
        .bail(),

    body("amount")
        .exists().withMessage("amount parameter is missing from body")
        .bail()
        .custom(amountVal => {
            if(amountVal <= 0)
                return Promise.reject("Amount cannot be 0 or less")
            return Promise.resolve()
        }),

    body("quantity")
        .exists().withMessage("quantity parameters is missing from body")
        .bail()
        .isInt().withMessage("quantity can only be an integer whole number")
        .custom(quantityVal => {
            if(quantityVal < 1)
                return Promise.reject("Quantity cannot be less than 1")
            return Promise.resolve()
        }),    

    body("assetType")
        .exists().withMessage("asset type parameter is missing from body")
        .bail()
        .isIn(EnumCollection.assetTypeEnum).withMessage(`asset type can only be ${EnumCollection.assetTypeEnum.join(" | ")}`)
]




// ==== Validating Sell Assets ====
exports.checkSellAsset = [
    body("ticker")
        .exists().withMessage("ticker parameter is missing.")
        .bail()
        .isAlphanumeric().withMessage("Ticker can only be a string"),

    body("amount")
        .exists().withMessage("amount parameter is missing from body")
        .bail()
        .custom(amountVal => {
            if(amountVal < 0)
                return Promise.reject("Amount cannot be less than 0")
            return Promise.resolve()
        }),

    body("quantity")
        .exists().withMessage("quantity parameters is missing from body")
        .bail()
        .isInt().withMessage("quantity can only be an integer whole number")
        .custom(quantityVal => {
            if(quantityVal < 1)
                return Promise.reject("Quantity cannot be less than 1")
            return Promise.resolve()
        }),  
        
    body("assetType")
        .exists().withMessage("asset type parameter is missing from body")
        .bail()
        .isIn(EnumCollection.assetTypeEnum).withMessage(`asset type can only be ${EnumCollection.assetTypeEnum.join(" | ")}`)
]




// ==== Validation for delete trade ====
exports.checkDeleteTrade = [
    param("id")
        .exists().withMessage("TradeId is missing from URL parameters")
        .bail()
        .isMongoId().withMessage("Trade Id is not a valid Id.")
]




// ==== Validating Update Trade ====
exports.checkUpdateTrade = [
    param("id")
        .exists().withMessage("TradeId is missing from URL parameters")
        .bail()
        .isMongoId().withMessage("Trade Id is not a valid Id."),

    body("ticker")
        .exists().withMessage("ticker parameter is missing.")
        .bail()
        .isAlphanumeric().withMessage("Ticker can only be a string"),

    body("amount")
        .exists().withMessage("amount parameter is missing from body")
        .bail()
        .custom(amountVal => {
            if(amountVal < 0)
                return Promise.reject("Amount cannot be less than 0")
            return Promise.resolve()
        }),

    body("quantity")
        .exists().withMessage("quantity parameters is missing from body")
        .bail()
        .isInt().withMessage("quantity can only be an integer whole number")
        .custom(quantityVal => {
            if(quantityVal < 1)
                return Promise.reject("Quantity cannot be less than 1")
            return Promise.resolve()
        }),  
        
    body("tradeType")
        .exists().withMessage("Trade type is missing from body")
        .bail()
        .isIn(EnumCollection.tradeTypeEnum).withMessage(`Trade type can only be ${EnumCollection.tradeTypeEnum.join(" | ")}`)
]