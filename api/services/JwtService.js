/****************************************************
 * Service to issue and verify JSON Web Tokens (JWT)
 ****************************************************/
var jwt = require('jsonwebtoken'),

    // THE SECRET USED TO ENCODE AND DECODE JWT payload
    // TODO: MOVE THIS TO ENVIRONMENT VARIABLES
    tokenSecret = "secretissecet";


// Generates a token from supplied payload
module.exports.issue = function(payload) {
    var token = jwt.sign(
        payload,
        tokenSecret, // Secret that we sign the JWT with
        {
            expiresIn: 18000 // Token Expire time
        }
    );
    return token;
};



// Verifies token on a request
module.exports.verify = function(token, callback) {
    return jwt.verify(
        token, // The token to be verified
        tokenSecret, // Same token we used to sign
        {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        callback //Pass errors or decoded token to callback
    );
};