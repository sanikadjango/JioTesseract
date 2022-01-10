const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));



//DB

const mongoose = require('mongoose');
const DB_URI = 'mongodb://localhost:27017/jiotesseract';
mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.once('open', ()=> console.log('MongoDB connected'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//import routes
const indexRouter = require('./routes/index')
app.use('/', indexRouter);



//To vacate slots after wait time if over and slot is still not occupied
const ParkingSlot = require('./models/parking_slot');
const moment = require('moment');
setInterval(()=>{
    console.log("checking to mark unused slots as vacant");

    ParkingSlot.updateMany({
        clear_time:{
            $lte: new Date(moment().utcOffset(660).format('YYYY-MM-DD HH:mm:ss'))
        },
        status: 'vacant',
        booked: true
    },{
        $set:{
            booked: false,
            clear_time: null,
            user_id: null,
            parking_number: null
        }
    })
    .then(result =>{
        console.log("Vacated slots count:", result.modifiedCount);
    })
    .catch(err =>{
        console.log(err)
    })
    
}, 300000); // run every 5 minutes 




app.listen(8888, ()=>{
    console.log('Serving on port 8888');
})


