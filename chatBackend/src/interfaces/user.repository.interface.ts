import { Ipolldetails, IUser } from "./user.interface";

export interface IUserRepository{
    createUser(userData:Partial<IUser>):Promise<IUser | null>,
    findbyEmail(email:string):Promise<IUser | null>,
    getCurrentUser(userId: string): Promise<IUser | null>;

    searchUsers(searchterm:string , username:string):Promise<any | null>
    allUsers(currentuserId:string):Promise<any | null>
    chathistory(userId1:any , userId2:any):Promise<any | null>
    updateProfilePic(userId: string, updateData: { profileImage: string }): Promise<any>;
    updateName(userId: string, updateData: { name: string }): Promise<any>;
    updateStatus(userId: string, updateData: { status: boolean }): Promise<any>;
    updateStatusnew(userId: string, updateData: { status: boolean }): Promise<any>;

}


export interface IpollRepository{
    createPoll(pollDetails : Partial<Ipolldetails>):Promise<any | null>
    getallPolls(limit:number ,offset:number):Promise<any | null>
    getUserPolls(userid:any):Promise<any | null>
    countPoll():Promise<number>
    deletePoll(pollid:string):Promise<any>

}