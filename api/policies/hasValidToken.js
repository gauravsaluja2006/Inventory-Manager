/*****************************************************
 * POLICY TO CHECK IF A USER IS LOGGED IN
 * THIS IS A MIDDLEWARE FUNCTION AND WILL BE CALLED
 * BEFORE THE REQUEST IS SERVED AT THE CONTROLLERS.
 * IF THE USER DOES NOT HAVE A VALID JWT, 
 * RETURN 401 UNAUTHORIZED HTTP STATUS CODE
 *****************************************************/
module.exports = function(req, res, next) {

    var token;

    /**************************************************************
     * JWT TOKEN IS ADDED IN Authorization HEADER IN HTTP REQUEST
     *************************************************************/
    if (req.headers && req.headers.authorization) {

        // HEADER FORMAT --> Authorization: Bearer [TOKEN]
        var parts = req.headers.authorization.split(' ');

        if (parts.length == 2) {

            // TOKEN AUTH SCHEME
            var scheme = parts[0],

                // TOKEN
                credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            } else {

                // INVALID TOEKN AUTH SCHEME
                return res.json(401, { error: true, message: 'Format is Authorization: Bearer [token]' });
            }

        } else {

            // INVALID TOKEN FORMAT
            return res.json(401, { error: true, message: 'Format is Authorization: Bearer [token]' });
        }

    } else {
        return res.json(401, { error: true, message: 'No Authorization header was found' });
    }

    JwtService.verify(token, function(err, token) {

        if (err) return res.json(401, { error: true, message: 'Invalid Token!' });

        req.token = token; // THIS IS THE DECODED TOKEN OR THE PAYLOAD YOU PROVIDED

        // MOVE TO NEXT MIDDLEWARE FUNCTION
        next();
    });
};