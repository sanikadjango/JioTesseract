# Jio Tesseract Assignment


Pre-requisites:
Node v14.16.0, Mongodb v4.2.3


Install the dependencies:
npm install

Run mongodb:
mongod --dbpath <dbpath> port --27017

To populate DB with parking slot records:
node populate_parking_slot_data.js
 
To run application: 
node app.js

Inputs required for each API are mentioned in routes/index.js







