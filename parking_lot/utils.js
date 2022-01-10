const totalSlots = 120;
const halfCapacity = totalSlots/2;
const ParkingSlot = require('./models/parking_slot');

async function isHalfCapacityUtilized(){

    let bookedSlots = await ParkingSlot.find({
        booked: true
    }).count();

    if(bookedSlots >= halfCapacity){
        return true
    }
    else{
        return false
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

module.exports ={
    isHalfCapacityUtilized: isHalfCapacityUtilized,
    getRandomNumber: getRandomNumber
}