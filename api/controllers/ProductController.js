/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
};

// FUNCTION TO HANDLE REQUEST TO CREATE A NEW PRODUCT
// @param: name
// @param: description
// @param: quantity
// @param: minimum_quantity
function createNewProduct(req, res) {

    // RETURN OBJECT STRUCTURE
    var returnObject = {
        product: null,
        statusCode: null,
        message: null
    };

    // RETURN STATUS CODES
    var PRODUCT_CREATED_SUCCESSFULLY_CODE = 1;
    var SERVER_ERROR_RETURN_CODE = 2;
    var MISSING_PRODUCT_NAME_CODE = 3;
    var MISSING_PRODUCT_DESCRIPTION_CODE = 4;
    

    // MESSAGES
    var PRODUCT_TYPE_CREATED_SUCCESS_MESSAGE = "Product Created Successfully";
    var SERVER_ERROR_MESSAGE = "Some error occured";
    var MISSING_PRODUCT_TYPE_NAME_MESSAGE = "Please provide a name for the Product";
    var MISSING_PRODUCT_TYPE_DESCRIPTION_MESSAGE = "Please provide description for the Product";


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

    var product_name = req.body.name.trim();
    var product_description = req.body.description.trim();
    var quantity = parseInt(req.body.quantity) || 0;
    var minimum_quantity = parseInt(req.body.minimum_quantity) || 0;


    // CREATING NEW PRODUCT
    Product.create({
        'name': product_name,
        'description': product_description,
        'quantity': quantity,
        'minimum_quantity': minimum_quantity,
        'created_by': req.token.id
    }).exec(function(err, newProduct) {

        // ERROR IN CREATION
        if (err) {

            // VALIDATION ERROR
            if (err["code"] == VALIDATION_ERROR_TYPE) {
                var validationErrorMessage = HandleValidation.transformValidationErrors(Product, err.invalidAttributes);
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
            returnObject.product = newProduct;
            returnObject.statusCode = PRODUCT_CREATED_SUCCESSFULLY_CODE;
            returnObject.message = PRODUCT_CREATED_SUCCESS_MESSAGE;
            return res.json(returnObject);
        
        }
    })
}