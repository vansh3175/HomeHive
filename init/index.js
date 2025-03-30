require('dotenv').config();
const {data} = require('./data.js');
const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const MONGO_URL=process.env.MONGO_URL;

main()
.then((result)=>{
    console.log("connected to databases successfully");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

async function initialize(){
    await Listing.deleteMany();
    await Listing.insertMany(data);
}

initialize().then(()=>{
    console.log("data inserted successfully");
})
.catch((err)=>{
    console.log(err);
})