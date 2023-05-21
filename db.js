//CONNECTING MONGODB TO NODEJS VIA MONGOOSE

const DATABASE = process.env.DATABASE
const mongoose=require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/myNotes?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";

const connectToMongo = ()=>{
    mongoose.set('strictQuery', true);
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to database succesfully");
        (err) => {
            if(err) console.log(err) 
            else console.log("mongdb is connected");
           }
    })
    

}

//Exports this module so that it could be imported by other files to connect to the database
module.exports = connectToMongo;