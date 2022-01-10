const ParkingSlot = require('./models/parking_slot');

const mongoose = require('mongoose');
const DB_URI = 'mongodb://localhost:27017/jiotesseract';
mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.once('open', ()=> console.log('MongoDB connected'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const totalSlots = 120;
const reservedSlots = totalSlots * 20 / 100;
const generalSlots = totalSlots - reservedSlots;

let reserved = [];
let general = [];

for(let i=1; i <= reservedSlots; i++){
    reserved.push(i);
}

for(let i=1; i <= generalSlots; i++){
    general.push(i);
}

function promiseForReserved(){
    return new Promise((resolve, reject)=>{
        ParkingSlot.create({
            status: 'vacant',
            type: 'reserved',
            booked: false
        }).then(slot=>{
            resolve();
        })
    })
}

function promiseForGeneral(){
    return new Promise((resolve, reject)=>{
        ParkingSlot.create({
            status: 'vacant',
            type: 'general',
            booked: false
        }).then(slot=>{
            resolve();
        })
    })
}

reserved.reduce(async(previousPromise) =>{
    await previousPromise;
    return promiseForReserved();
}, Promise.resolve())
.then(()=>{
    console.log("Added records for reserved parking slots");
})

general.reduce(async(previousPromise) =>{
    await previousPromise;
    return promiseForGeneral();
}, Promise.resolve())
.then(()=>{
    console.log("Added records for general parking slots");
})