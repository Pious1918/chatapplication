import { Ipolldetails, IUser } from "../interfaces/user.interface";
import chatModel from "../models/chatModel";
import userModel from "../models/userModel";
import { BaseRepository } from "./baseRepo";


export class userRepository extends BaseRepository<any>{

    constructor(){
        super(userModel)
    }

    async createUser(userdata:Partial<IUser>): Promise<IUser | null>{
        console.log("new user at repo")
        return this.save(userdata)
    }

    async findbyEmail(email:string):Promise<IUser | null>{
        return await this.findOne({email})
    }

    async getCurrentUser(userId: string) {
        return await this.findById(userId)
    }

    async searchUsers(searchterm:string , currentUser:string){
        const users = await userModel.find({name:{$regex:searchterm , $options: 'i'}})
        return users.filter(user=>user._id.toString() !==currentUser)
    }
    async allUsers(currentuserId:string){
        const users = await userModel.find()
        return users.filter(user=>user._id.toString() !==currentuserId)
    }

    async chathistory(userId1:any , userId2:any){
        return await chatModel.find({
            $or:[
                {senderId:userId1 ,receiverId:userId2},
                {senderId:userId2 , receiverId:userId1}
            ]
        }).sort("timeStamp")    
        .populate("receiverId", "name email profileImage status"); // Populate receiverId from User model with selected fields

    }

    async createPoll(pollDetails:Ipolldetails){
       
    }

    async updateProfilePic(userId: string, updateData: { profileImage: string }) {
        return this.updateById(userId, updateData); 
    }

    async updateName(userId: string, updateData: { name: string }) {
        return this.updateById(userId, updateData); 
    }

    async updateStatus(userId: string, updateData: { status: boolean }) {
        return this.updateById(userId, updateData); 
    }
    async updateStatusnew(userId: string, updateData: { status: boolean }) {
        return this.updateById(userId, updateData); 
    }
}