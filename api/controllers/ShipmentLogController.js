/**
 * ShipmentLogController
 *
 * @description :: Server-side logic for managing Shipmentlogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    logShipment: logShipment
};

// FUNCTION TO HANDLE REQUEST TO LOG A SHIPMENT INFORMATION
// @param: product
// @param: vendor
// @param: quantity
// @param: transaction_type
function logShipment(req, res) {

    // RETURN OBJECT STRUCTURE
    var returnObject = {
        shipment: null,
        statusCode: null,
        message: null
    };

    // RETURN STATUS CODES
    var SHIPMENT_LOGGED_SUCCESSFULLY_CODE = 1;
    var SERVER_ERROR_RETURN_CODE = 2;
    var MISSING_PRODUCT_ID_CODE = 3;
    var MISSING_VENDOR_ID_CODE = 4;
    var MISSING_TRANSACTION_TYPE_CODE = 5;
    var INVALID_PRODUCT_ID_CODE = 6;
    var INVALID_VENDOR_ID_CODE = 7;
    var INVALID_QUANTITY_CODE = 8;

    // MESSAGES
    var SHIPMENT_LOGGED_SUCCESSFULLY_MESSAGE = "Product Shipment Logged Successfully";
    var SERVER_ERROR_MESSAGE = "Some Error Occurred";
    var MISSING_PRODUCT_ID_MESSAGE = "Please Specify a valid Product ID";
    var MISSING_VENDOR_ID_MESSAGE = "Please Specify a valid Vendor ID";
    var MISSING_TRANSACTION_TYPE_MESSAGE = "Please Specify a valid Transaction Type";
    var INVALID_PRODUCT_ID_MESSAGE = "Product with given ID does not exist";
    var INVALID_VENDOR_ID_MESSAGE = "Vendor with given ID does not exist";
    var INVALID_QUANTITY_MESSAGE = "Please Enter a valid Quantity";

    // ERROR TYPES (RETURNED BY SAILS ON DATABASE ENTRY)
    var VALIDATION_ERROR_TYPE = "E_VALIDATION";
    var SERVER_ERROR_TYPE = "E_SERVER";

    if (isNaN(req.body.product)) {
        returnObject.statusCode = MISSING_PRODUCT_ID_CODE;
        returnObject.message = MISSING_PRODUCT_ID_MESSAGE;
        return res.badRequest(returnObject);
    }

    if (isNaN(req.body.vendor)) {
        returnObject.statusCode = MISSING_VENDOR_ID_CODE;
        returnObject.message = MISSING_VENDOR_ID_MESSAGE;
        return res.badRequest(returnObject);
    }

    if (isNaN(req.body.quantity)) {
        returnObject.statusCode = INVALID_QUANTITY_CODE;
        returnObject.message = INVALID_QUANTITY_MESSAGE;
        return res.badRequest(returnObject);
    }

    if (!req.body.transaction_type || ['IN', 'OUT'].indexOf(req.body.transaction_type) == -1) {
        returnObject.statusCode = MISSING_TRANSACTION_TYPE_CODE;
        returnObject.message = MISSING_TRANSACTION_TYPE_MESSAGE;
        return res.badRequest(returnObject);
    }

    var product_id = req.body.product;
    var vendor_id = req.body.vendor;
    var quantity = parseInt(req.body.quantity);
    var transaction_type = req.body.transaction_type;

    console.log("GOT: ", product_id, vendor_id, quantity, transaction_type);

    Product.findOne({ id: product_id }).exec(function(err, product) {

        if (err) {
            returnObject.statusCode = SERVER_ERROR_RETURN_CODE;
            returnObject.message = SERVER_ERROR_MESSAGE;
            return res.badRequest(returnObject);
        } else if (!product) {
            returnObject.statusCode = INVALID_PRODUCT_ID_CODE;
            returnObject.message = INVALID_PRODUCT_ID_MESSAGE;
            return res.badRequest(returnObject);
        } else {
            console.log("GOT VALID PRODUCT");
            Vendors.findOne({ id: vendor_id }).exec(function(err, vendor) {

                if (err) {
                    returnObject.statusCode = SERVER_ERROR_RETURN_CODE;
                    returnObject.message = SERVER_ERROR_MESSAGE;
                    return res.badRequest(returnObject);
                } else if (!vendor) {
                    returnObject.statusCode = INVALID_VENDOR_ID_CODE;
                    returnObject.message = INVALID_VENDOR_ID_MESSAGE;
                    return res.badRequest(returnObject);
                } else {
                    ShipmentLog.create({
                        product: product_id,
                        vendor: vendor_id,
                        user: 1,
                        quantity: quantity,
                        transaction_type: transaction_type
                    }).exec(function(err, shipment) {
                        if (err) {
                            returnObject.statusCode = SERVER_ERROR_RETURN_CODE;
                            returnObject.message = SERVER_ERROR_MESSAGE;
                            return res.badRequest(returnObject);
                        } else {
                            returnObject.shipment = shipment;
                            returnObject.statusCode = SHIPMENT_LOGGED_SUCCESSFULLY_CODE;
                            returnObject.message = SHIPMENT_LOGGED_SUCCESSFULLY_MESSAGE;
                            return res.json(returnObject);
                        }
                    })
                }
            })

        }
    })

}