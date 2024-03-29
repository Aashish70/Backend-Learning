require ('dotenv').config({path: './env'});

import dotenv from 'dotenv';
import connectDB from './db/index.js';


dotenv.config({
    path: './env'
});


connectDB()
.then(()=>{
    app.listen(process.env.port || 8000, ()=> {
        console.log(`Server is running on port ${process.env.port || 8000}`);
    })
})
.catch((err)=>{
    console.log("MONGO db conection failed", err);
})

/*
import express from "express";
const app = express();
( async () => {
    try {
    await mongoose.connect('${process.env.MONGO_URI},/${DB_NAME}')
    app.on("error", (error) => {
        console.log("Error: ", error);
        throw error;
    });

    app.listen(process.env.PORT, () => {
        console.log("Server is running on port: ", process.env.PORT);
    });

    }
    catch (error) {
        console.log("Error: ", error);
    }
})();
*/