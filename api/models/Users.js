/**
 * Users.js
 *
 * USERS MODEL TO MANAGE THE APPLICATIONS USERS.
 *
 *   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *   ATTRIBUTES:
 *
 *   id                NOT REQUIRED       User ID (autoIncrement, NOT REQUIRED)
 *   username          REQUIRED           User's Login Username (REQUIRED)
 *   first_name        REQUIRED           User's First Name (REQUIRED)
 *   last_name         NOT REQUIRED       User's Last Name (OPTIONAL)
 *   email             REQUIRED           User's Email ID (REQUIRED, UNIQUE)
 *   password          REQUIRED           User's hashed password (using bcrypt)
 *
 *   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *   BASIC MODEL QUERY OPERATIONS:
 *
 *   --> To create new user
 *   Users.create({first_name: 'Gaurav', last_name: 'Saluja', 'username': 'Gaurav', email: 'gauravsaluja2006@gmail.com', password: 'test@123'}).exec(function(err, newUser) {})
 * 
 *   --> To create multiple new users
 *   Users.create([{}, {}, {}, {}]).exec(function(err, users) {})
 * 
 *   --> To get all users use
 *   Users.find().then(users => {}).catch()
 * 
 *   --> To get a user with id or username use
 *   Users.findOne({id: 1, email: 'gauravsaluja2006@gmail.com'}).then(user => {}).catch()
 * 
 *   --> To get the count of all the user objects, use
 *   Users.count().then(count => {}).catch()
 * 
 *   --> for more: refer to
 *   https://github.com/balderdashy/waterline-docs/blob/master/models/associations/many-to-many.md
 * 
 */

/*********************************
 * MODULE TO HASH USER PASSWORDS *
 ********************************/
var bcrypt = require('bcrypt');


module.exports = {
    attributes: {

        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },

        first_name: {
            type: 'string',
            required: true,
            unique: false
        },

        last_name: {
            type: 'string',
            required: false,
            unique: false
        },

        username: {
            type: 'string',
            required: true,
            unique: true
        },

        email: {
            type: 'email',
            required: false,
            unique: true
        },

        password: {
            type: 'string',
            minLength: 6,
            required: true
        },

        /*************************************************
         * THIS IS CALLED WHEN RETURNING A USER OBJECT  
         * DELETING PASSWORD BEFORE RETURNING        
         *************************************************/
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },

    // VALIDATION ERROR STRINGS (FOR EACH RULE OF EVERY ATTRIBUTE OF MODEL)
    validationMessages: {
        first_name: {
            required: 'Please fill in your First Name',
        },
        email: {
            required: 'Please enter an Email Address',
            unique: 'Sorry, a user with given Email ID already exists',
            email: 'Please enter a valid Email ID'
        },
        username: {
            required: 'Please enter a Username',
            unique: 'Sorry, a user with given Username already exists'
        },
        password: {
            required: 'Please fill in the password',
            minLength: 'password should be at least 6 characters long'
        }
    },

    // before creating new user, hash their password using bcrypt
    beforeCreate: hashPassword

};

/******************************************************************
 * FUNCTION TO HASH USER'S PASSWORD BEFORE SAVING IN THE DATABASE. 
 * PASSED IN USER OBJECT TO BE SAVED TO THE DATABASE AND
 * CALLBACK FUNCTION TO BE CALLED WHEN THE CHANGES HAVE BEEN DONE.
 ****************************************************************/
function hashPassword(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                console.log(err);
                cb(err);
            } else {
                user.password = hash;
                cb();
            }
        });
    });
}

