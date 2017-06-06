/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  Users.count().exec(function(err, usersCount) {
    if (usersCount === 0) {

      console.log("Initializing the Database ...");

      var default_user = {
        "first_name": "Inventory",
        "last_name": "Manager",
        "username": "inventory",
        "email": "",
        "password": "inventory@123"
      };

      Users.create(default_user).then(user => {
        console.log("Successfully Created the New User");
        cb();
      }).catch(err => {
        console.log("Error in setting up the system!");
      })

    } else {
      cb();
    }
  })
  
};
