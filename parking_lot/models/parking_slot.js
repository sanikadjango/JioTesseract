const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let parkingSlotSchema = new Schema({
    
	user_id: {type: Schema.Types.ObjectId, ref: 'User', unique : true}, //username
    status: {type: String, required: true}, //vacant or occupied
    clear_time: {type: Date}, //time after which the slot will become vacant if not occupied
    type: {type: String, required: true}, //reserved or general
    booked: {type: Boolean, required: true},
    parking_number: {type: Number}
});

module.exports = mongoose.model('Parking_Slot', parkingSlotSchema);