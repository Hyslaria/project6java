const mongoose = require("mongoose");
module.exports = function(db) {


    // Defines an attendee within an event
    let Schema = mongoose.Schema;

    let gameSchema = new Schema({
        opponet: String,
        location: String,
        date: { type: Date, default: Date.now },
        completions: Number,
        attempts: Number,
        yards: Number,
        touchdowns: Number,
        interceptions: Number
    });

    // This defines an event
    let playerSchema = new Schema({
        name: String,
        age: Number,
        hometown: String,
        school: String,
        games: [gameSchema]
    });


    return db.model('player', playerSchema);


};
