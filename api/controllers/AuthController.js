/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login: login
};

// NODE MODEULE TO HASH PASSWORD
let bcrypt = require('bcrypt');

function login(req, res) {

    // RETURN OBJECT STRUCTURE
    var returnObject = {
        user: null,
        statusCode: null,
        message: null
    };

    // RETURN CODE
    var INVALID_USERNAME_OR_PASSWORD_CODE = 1;
    var LOGIN_SUCCESSFUL_CODE = 2;


    // RETURN MESSAGES
    var INVALID_USERNAME_OR_PASSWORD_MESSAGE = "Invalid Username or Password";
    var LOGIN_SUCCESSFUL_MESSAGE = "Welcome";

    // REQUEST BODY PARAMETERS (username & password)
    var email = req.body.username;
    var passwordAttempt = req.body.password;

    // MISSING REQUEST PARAMETERS
    if(!email || !passwordAttempt) {
        returnObject.statusCode = INVALID_USERNAME_OR_PASSWORD_CODE;
        returnObject.message = INVALID_USERNAME_OR_PASSWORD_MESSAGE;
        res.badRequest(returnObject);
    }

    // FINDING THE USER IN THE DATABASE (matching username or email)
    Users.findOne({
        or: [
            { username: email },
            { email: email }
        ]
    }, function(err, user) {

        // ERROR IN FINDING THE USER (WILL HANDLE THIS LATER)
        if (err) {}

        // USER NOT FOUND
        if (!user) {

            returnObject.statusCode = INVALID_USERNAME_OR_PASSWORD_CODE;
            returnObject.message = INVALID_USERNAME_OR_PASSWORD_MESSAGE;

            return res.json(returnObject);

        } else {

            // COMPARING PASSWORD ATTEMPT WITH ENCRYPTED PASSWORD
            bcrypt.compare(passwordAttempt, user.password).then(isPasswordValid => {

                if (isPasswordValid) {

                    // THIS IS THE PAYLOAD WHICH WILL BE ENCODED AND SAVED IN THE JWT
                    var userData = {
                        id: user.id,
                        user: user
                    };

                    res.json({
                        user: user,
                        token: JwtService.issue(userData)
                    })


                } else {
                    // INVALID PASSWORD
                    returnObject.statusCode = INVALID_USERNAME_OR_PASSWORD_CODE;
                    returnObject.message = INVALID_USERNAME_OR_PASSWORD_MESSAGE;

                    return res.json(returnObject);

                }
            });
        }
    });
}
