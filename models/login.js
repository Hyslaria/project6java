const mongoose = require("mongoose");
module.exports = function(db) {
    let loginSchema = new mongoose.Schema({
        login: String,
        password: String,
        salt: String,
        firstname: String,
        lastname: String,
        email: String
    });

    return db.model('login', loginSchema);


};
