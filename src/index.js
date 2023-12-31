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