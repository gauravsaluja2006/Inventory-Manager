/**
 * Product_typeController
 *
 * @description :: Server-side logic for managing product_types
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createNewProductType: createNewProductType,
    getAllProductTypeList: getAllProductTypeList
};

// FUNCTION TO HANDLE REQUEST TO CREATE A NEW PRODUCT TYPE
// @param: name
// @param: description
function createNewProductType(req, res) {

    // RETURN OBJECT STRUCTURE
    var returnObject = {
        productType: null,
        statusCode: null,
        message: null
    };

    // RETURN STATUS CODES
    var PRODUCT_TYPE_CREATED_SUCCESSFULLY_CODE = 1;
    var SERVER_ERROR_RETURN_CODE = 2;
    var MISSING_PRODUCT_TYPE_NAME_CODE = 3;
    var MISSING_PRODUCT_TYPE_DESCRIPTION_CODE = 4;
    

    // MESSAGES
    var PRODUCT_TYPE_CREATED_SUCCESS_MESSAGE = "Product Type Created Successfully";
    var SERVER_ERROR_MESSAGE = "Some error occured";
    var MISSING_PRODUCT_TYPE_NAME_MESSAGE = "Please provide a name for the Product Type";
    var MISSING_PRODUCT_TYPE_DESCRIPTION_MESSAGE = "Please provide description for the Product Type";


    // ERROR TYPES (RETURNED BY SAILS ON DATABASE ENTRY)
    var VALIDATION_ERROR_TYPE = "E_VALIDATION";
    var SERVER_ERROR_TYPE = "E_SERVER";

    if (!req.body.name) {
        returnObject.statusCode = MISSING_PRODUCT_TYPE_NAME_CODE;
        returnObject.message = MISSING_PRODUCT_TYPE_NAME_MESSAGE;
        return res.badRequest(returnObject);
    }

    if (!req.body.description) {
        returnObject.statusCode = MISSING_PRODUCT_TYPE_DESCRIPTION_CODE;
        returnObject.message = MISSING_PRODUCT_TYPE_DESCRIPTION_MESSAGE;
        return res.badRequest(returnObject);
    }

    var product_type_name = req.body.name.trim();
    var product_type_description = req.body.description.trim();


    // CREATING NEW PRODUCT TYPE
    ProductType.create({
        'name': product_type_name,
        'description': product_type_description,
        'created_by': req.token.id
    }).exec(function(err, newProductType) {

        // ERROR IN CREATION
        if (err) {

            // VALIDATION ERROR
            if (err["code"] == VALIDATION_ERROR_TYPE) {
                var validationErrorMessage = HandleValidation.transformValidationErrors(ProductType, err.invalidAttributes);
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

            // PROFESSIONAL GROUP CREATED SUCCESSFULLY
            returnObject.productType = newProductType;
            returnObject.statusCode = PRODUCT_TYPE_CREATED_SUCCESSFULLY_CODE;
            returnObject.message = PRODUCT_TYPE_CREATED_SUCCESS_MESSAGE;
            return res.json(returnObject);
        
        }
    })
}


function getAllProductTypeList(req, res) {

    returnObject = {
        productTypes: []
    }

    ProductType.find().exec(function(err, productTypes) {

        returnObject.productTypes = productTypes;
        return res.json(returnObject);
        
    })
}