import mongoose, { Schema } from "mongoose";


const messageSchema:Schema = new Schema({

    senderId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        required:true
    },
    timeStamp:{
        type:Date,
        default:() => Date.now()
    },
    

},
{timestamps:true}
)


export default mongoose.model('Message', messageSchema)