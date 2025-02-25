import mongoose from "mongoose";

import dotenv from 'dotenv'

dotenv.config()


const mongurl = process.env.MONGO_URL
const connectDB = async()=>{

    console.log(`mongo url is ${mongurl}`)

    try {
        await mongoose.connect(mongurl as string)
        console.log("DB connected")
    } catch (error) {
        console.error("MOngo db connection failed",error)
    }
}


export default connectDB