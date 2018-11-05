var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var colors = require('colors');

const SALT = "trytoguessthissalt";

// Define the Photos schema
var UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    email: String,
    password: String
});

// Export the model
var Users = mongoose.model('Users', UsersSchema);

module.exports = Users;

// Add the create user method
module.exports.createUser = function (newUser) {
    return new Promise(function (resolve, reject) {

        // Docs: https://www.npmjs.com/package/bcryptjs#usage---async
        bcrypt.genSalt(10, function (err, SALT) {
            bcrypt.hash(newUser.password, SALT, function (err, hash) {
                if (err) {
                    reject(err);
                }
                // Scramble the password 
                newUser.password = hash;
                newUser.save(resolve);
            });
        });
    });

}