/**
 * CategoryGroupController
 *
 * @description :: Server-side logic for managing Categorygroups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createNewCategoryGroup: createNewCategoryGroup,
    getCategoryGroupDetails: getCategoryGroupDetails
};

function createNewCategoryGroup(req, res) {

    // RETURN OBJECT STRUCTURE
    var returnObject = {
        categoryGroup: null,
        statusCode: null,
        message: null
    };
    
    // RETURN STATUS CODES
    var CATEGORY_GROUP_CREATED_SUCCESSFULLY_CODE = 1;
    var SERVER_ERROR_RETURN_CODE = 2;
    var MISSING_CATEGORY_GROUP_NAME_CODE = 3;
    

    // MESSAGES
    var CATEGORY_GROUP_CREATED_SUCCESS_MESSAGE = "Category Group Created Successfully";
    var SERVER_ERROR_MESSAGE = "Some error occured";
    var MISSING_CATEGORY_GROUP_NAME_MESSAGE = "Please provide a name for the Category Group";
   

    // ERROR TYPES (RETURNED BY SAILS ON DATABASE ENTRY)
    var VALIDATION_ERROR_TYPE = "E_VALIDATION";
    var SERVER_ERROR_TYPE = "E_SERVER";

    if (!req.body.name) {
        returnObject.statusCode = MISSING_CATEGORY_GROUP_NAME_CODE;
        returnObject.message = MISSING_CATEGORY_GROUP_NAME_MESSAGE;
        return res.badRequest(returnObject);
    }

    var category_group_name = req.body.name.trim();

    CategoryGroup.create({
        'name': category_group_name,
        'created_by': req.token.id
    }).exec(function(err, newCategoryGroup) {

        // ERROR IN CREATION
        if (err) {

            // VALIDATION ERROR
            if (err["code"] == VALIDATION_ERROR_TYPE) {
                var validationErrorMessage = HandleValidation.transformValidationErrors(CategoryGroup, err.invalidAttributes);
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
            returnObject.categoryGroup = newCategoryGroup;
            returnObject.categoryGroup.types = [];
            returnObject.statusCode = CATEGORY_GROUP_CREATED_SUCCESSFULLY_CODE;
            returnObject.message = CATEGORY_GROUP_CREATED_SUCCESS_MESSAGE;
            return res.json(returnObject);

        }
    })
}

function getCategoryGroupDetails(req, res) {
    CategoryGroup.find().populate('types').exec(function(err, groups) {
        res.json(groups);
    })
}