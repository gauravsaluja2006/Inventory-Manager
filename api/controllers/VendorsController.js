/**
 * VendorsController
 *
 * @description :: Server-side logic for managing Vendors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getAllVendorsList: getAllVendorsList,
    createNewVendor: createNewVendor,
    editVendor: editVendor,
    suspendVendor: suspendVendor
};

// FUNCTION TO HANDLE REQUEST TO CREATE A NEW VENDOR
// @param: name
function createNewVendor(req, res) {

    // RETURN OBJECT STRUCTURE
    var returnObject = {
        vendor: null,
        statusCode: null,
        message: null
    };

    // RETURN STATUS CODES
    var VENDOR_CREATED_SUCCESSFULLY_CODE = 1;
    var SERVER_ERROR_RETURN_CODE = 2;
    var MISSING_VENDOR_NAME_CODE = 3;


    // MESSAGES
    var VENDOR_CREATED_SUCCESS_MESSAGE = "New Vendor Created Successfully";
    var SERVER_ERROR_MESSAGE = "Some error occured";
    var MISSING_VENDOR_NAME_MESSAGE = "Please provide a name for the Vendor";


    // ERROR TYPES (RETURNED BY SAILS ON DATABASE ENTRY)
    var VALIDATION_ERROR_TYPE = "E_VALIDATION";
    var SERVER_ERROR_TYPE = "E_SERVER";

    if (!req.body.name) {
        returnObject.statusCode = MISSING_VENDOR_NAME_CODE;
        returnObject.message = MISSING_VENDOR_NAME_MESSAGE;
        return res.badRequest(returnObject);
    }

    var vendor_name = req.body.name.trim();

    // CREATING NEW VENDOR
    Vendors.create({
        'name': vendor_name,
        'phone': req.body.phone,
        'created_by': req.token.id
    }).exec(function(err, newVendor) {

        // ERROR IN CREATION
        if (err) {

            // VALIDATION ERROR
            if (err["code"] == VALIDATION_ERROR_TYPE) {
                var validationErrorMessage = HandleValidation.transformValidationErrors(Vendors, err.invalidAttributes);
                returnObject.message = validationErrorMessage;
                returnObject.statusCode = VALIDATION_ERROR_RETURN_CODE;
                return res.badRequest(returnObject);

            } else {

                // OTHER ERRORS
                returnObject.message = SERVER_ERROR_MESSAGE;
                returnObject.statusCode = SERVER_ERROR_RETURN_CODE;
                return res.badRequest(returnObject);
            }

        } else {

            returnObject.vendor = newVendor;
            returnObject.statusCode = VENDOR_CREATED_SUCCESSFULLY_CODE;
            returnObject.message = VENDOR_CREATED_SUCCESS_MESSAGE;
            return res.json(returnObject);

        }
    })
}

function getAllVendorsList(req, res) {

    returnObject = {
        vendors: []
    }

    Vendors.find().exec(function(err, vendors) {

        returnObject.vendors = vendors;
        return res.json(returnObject);

    })
}

function editVendor(req, res) {

    var returnObject = {
        statusCode: null,
        message: null
    };

    // RETURN STATUS CODES
    var VENDOR_UPDATED_CODE = 1;
    var SERVER_ERROR_CODE = 2;
    var MISSING_VENDOR_ID_CODE = 3;
    var MISSING_CHANGE_PARAMETER_CODE = 4;

    // MESSAGES
    var VENDOR_UPDATED_MESSAGE = "Vendor Details Updated Successfully";
    var SERVER_ERROR_MESSAGE = "Some Error Occurred";
    var MISSING_VENDOR_ID_MESSAGE = "Please specify a valid Vendor ID";
    var MISSING_CHANGE_PARAMETER_MESSAGE = "Please specify name or description";

    var vendor_id = req.body.vendor_id;

    if (!req.body.name && !req.body.phone && !req.body.tin && !req.body.address) {
        returnObject.statusCode = MISSING_CHANGE_PARAMETER_CODE;
        returnObject.message = MISSING_CHANGE_PARAMETER_MESSAGE;
        return res.json(returnObject);
    }

    Vendors.findOne({ id: vendor_id }).exec(function(err, vendor) {
        if (err) {
            returnObject.statusCode = SERVER_ERROR_CODE;
            returnObject.message = SERVER_ERROR_MESSAGE;
            return res.badRequest(returnObject);
        } else if (!vendor) {
            returnObject.statusCode = MISSING_VENDOR_ID_CODE;
            returnObject.message = MISSING_VENDOR_ID_MESSAGE;
            return res.json(returnObject);
        } else {
            if (req.body.name) {
                vendor.name = req.body.name;
            }

            if (req.body.description) {
                vendor.description = req.body.description;
            }

            if (req.body.tin) {
                vendor.tin = req.body.tin;
            }

            if (req.body.address) {
                vendor.address = req.body.address;
            }

            vendor.save(function(err) {
                if (err) {
                    returnObject.statusCode = SERVER_ERROR_CODE;
                    returnObject.message = SERVER_ERROR_MESSAGE;
                    return res.badRequest(returnObject);
                } else {
                    returnObject.statusCode = VENDOR_UPDATED_CODE;
                    returnObject.message = VENDOR_UPDATED_MESSAGE;
                    res.json(returnObject);
                }
            })
        }
    })
}

function suspendVendor(req, res) {

    var returnObject = {
        statusCode: null,
        message: null
    };

    var VENDOR_SUSPENDED_CODE = 1;
    var SERVER_ERROR_CODE = 2;
    var MISSING_VENDOR_ID_CODE = 3;
    var VENDOR_NOT_FOUND_CODE = 4;

    var VENDOR_SUSPENDED_MESSAGE = "Vendor Suspended";
    var SERVER_ERROR_MESSAGE = "Some Error Occured";
    var MISSING_VENDOR_ID_MESSAGE = "Please Enter a valid Vendor ID";
    var VENDOR_NOT_FOUND_MESSAGE = "Vendor with given ID not found";

    if (isNaN(req.body.vendor_id)) {
        returnObject.statusCode = MISSING_VENDOR_ID_CODE;
        returnObject.message = MISSING_VENDOR_ID_MESSAGE;
        return res.json(returnObject);
    }

    var vendor_id = req.body.vendor_id;

    Vendors.findOne({ id: vendor_id }).exec(function(err, vendor) {
        if (err) {
            returnObject.statusCode = SERVER_ERROR_CODE;
            returnObject.message = SERVER_ERROR_MESSAGE;
            return res.badRequest(returnObject);
        } else if (!vendor) {
            returnObject.statusCode = VENDOR_NOT_FOUND_CODE;
            returnObject.message = VENDOR_NOT_FOUND_MESSAGE;
            return res.json(returnObject);
        } else {

            vendor.is_active = false;

            vendor.save(function(err) {
                if (err) {
                    returnObject.statusCode = SERVER_ERROR_CODE;
                    returnObject.message = SERVER_ERROR_MESSAGE;
                    return res.badRequest(returnObject);
                } else {
                    returnObject.statusCode = VENDOR_SUSPENDED_CODE;
                    returnObject.message = VENDOR_SUSPENDED_MESSAGE;
                    res.json(returnObject);
                }
            })
        }
    })


}