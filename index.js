const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const initdata = require("./data.js");

const MONGO_DB = "mongodb://127.0.0.1:27017/wanderdev";
main()
    .then(async() => {
        console.log("connected to DB");
        initDB();
    })
    .catch((err) =>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_DB);
}
const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data  = initdata.data.map((obj) => ({...obj,owner : "6ad375eda34ce60a6c39e088"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialize");
};