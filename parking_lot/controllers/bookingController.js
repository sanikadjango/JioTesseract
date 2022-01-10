
const User = require('../models/user');
const ParkingSlot = require('../models/parking_slot');

const utils = require('../utils');

const moment = require('moment');


module.exports = {

    login(req,res){

        User.findOne({
            emp_id: req.body.emp_id,
            password: req.body.password,
        }).then(user =>{
            if(user){
                res.json({
                    type: true,
                    data: user
                })
            }
            else{
                res.json({
                    type: false,
                    msg: 'User not found!'
                })
            }
        }).catch(err =>{
            console.error(err)
        })

    },

    register(req,res){

        let json = {
            emp_id: req.body.emp_id,
            password: req.body.password,
            name: req.body.name,
            type: req.body.type
        }

        User.create(json)
        .then(user =>{
            if(user){
                res.json({
                    type: true,
                    msg: 'User registered successfully!'
                })
            }
            else{
                res.json({
                    type: false
                })
            }
        }).catch(err =>{
            console.error(err)
        })
    },

    editUserDetails(req,res){

        User.updateOne({
            _id: req.body.user_id
        },{
            $set:{
                password: req.body.password,
                name: req.body.name,
                type: req.body.type
            }
        }).then(user =>{
            if(user.modifiedCount == 1){
                res.json({
                    type: true,
                    msg: 'User details edited!'
                })
            }
            else{
                res.json({
                    type: false
                })
            }
        }).catch(err =>{
            console.error(err)
        })

    },

    async bookSlot(req,res){

        let parkingNumber = utils.getRandomNumber(999999);

        let waitTime; //in minutes
        let isHalfCapacityUtilized = await utils.isHalfCapacityUtilized();

        if(isHalfCapacityUtilized){
            waitTime = 15; 
        }
        else{
            waitTime = 30;
        }

        //check if user already has a booked slot
        let userPS = await ParkingSlot.findOne({
            user_id: req.body.user_id
        })
        if(userPS){
            res.json({
                type: false,
                msg:'User already has a booked slot!'
            })
        }
        else{
            //Book a slot
            User.findOne({
                _id: req.body.user_id
            }).then(user =>{
                
                ParkingSlot.findOne({
                    type: user.type,
                    booked: false
                }).then(slot =>{
                    if(slot){
                        ParkingSlot.updateOne({
                            _id: slot._id
                        },{
                            $set:{
                                user_id: user._id,
                                booked: true,
                                clear_time: moment().utcOffset(660).add(waitTime, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                                parking_number: parkingNumber
                            }
                        }).then(result =>{
                            if(result.modifiedCount == 1){
                                res.json({
                                    type: true,
                                    parking_number: parkingNumber
                                })
                            }
                            else{
                                res.json({
                                    type: false,
                                })
                            }
                        })
                    }
                    else if(user.type == 'reserved'){

                        ParkingSlot.findOne({
                            type: 'general',
                            booked: false
                        }).then(generalSlot =>{
                            if(generalSlot){
                                ParkingSlot.updateOne({
                                    _id: generalSlot._id
                                },{
                                    $set:{
                                        user_id: user._id,
                                        booked: true,
                                        clear_time: moment().utcOffset(660).add(waitTime, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                                        parking_number: parkingNumber
                                    }
                                }).then(result =>{
                                    if(result.modifiedCount == 1){
                                        res.json({
                                            type: true,
                                            parking_number: parkingNumber
                                        })
                                    }
                                    else{
                                        res.json({
                                            type: false,
                                        })
                                    }
                                })
                            }
                        })
                    }
                    else{
                        res.json({
                            type: false,
                            msg: 'No available slots!'
                        })
                    }
                })
            }).catch(err =>{
                console.log(err)
            })

        }
        
    },

    checkIn(req,res){

        ParkingSlot.updateOne({
            user_id: req.body.user_id,
            parking_number: req.body.parking_number
        },{
            $set: {
                status: 'occupied'
            }
        }).then(slot =>{
            if(slot.modifiedCount == 1){
                res.json({
                    type: true,
                    msg: 'Parking slot occupied!'
                })
            }
            else{
                res.json({
                    type: false
                })
            }
        }).catch(err =>{
            console.error(err)
        })

    },

    checkOut(req,res){

        ParkingSlot.updateOne({
            user_id: req.body.user_id
        },{
            $set: {
                status: 'vacant',
                booked: false,
                user_id: null,
                parking_number: null,
                clear_time: null
            }
        }).then(slot =>{
            if(slot.modifiedCount == 1){
                res.json({
                    type: true,
                    msg: 'Parking slot is vacant now!'
                })
            }
            else{
                res.json({
                    type: false
                })
            }
        }).catch(err =>{
            console.error(err)
        })

    },

    getAllAvailableSlots(req,res){

        ParkingSlot.find({
            booked: false
        }).then(result =>{
            if(result.length > 0){
                res.json({
                    type: true,
                    data: result
                })
            }
            else{
                res.json({
                    type: false,
                    msg: 'No available slots'
                })
            }
        }).catch(err =>{
            console.error(err)
        })
    },

    getAllBookedSlots(req,res){

        ParkingSlot.find({
            booked: true
        }).then(result =>{
            if(result.length > 0){
                res.json({
                    type: true,
                    data: result
                })
            }
            else{
                res.json({
                    type: false,
                    msg: 'No booked slots'
                })
            }
        }).catch(err =>{
            console.error(err)
        })

    },

    getAllRegisteresUsers(req,res){

        User.find({})
        .then(users =>{
            if(users.length > 0){
                res.json({
                    type: true,
                    data: users
                })
            }
            else{
                res.json({
                    type: false,
                    msg: 'No users slots'
                })
            }
        }).catch(err =>{
            console.error(err)
        })

    }

}
