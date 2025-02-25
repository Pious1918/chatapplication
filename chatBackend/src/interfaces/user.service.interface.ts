import { IUser, IUserdata } from "./user.interface";



interface IuserService{
    registerUser(userdata:IUser):Promise<{success:boolean , message:string, data?:any}>,
    loginUser(loginData: IUserdata): Promise<{ success: boolean; message: string; data?: any }>;
    getCurrentuserDetails(userId: string): Promise<any | null>;
    searchUsers(searchTerm:string , currentUsername: any):Promise<any | null >;
    allUsers(currentId: any):Promise<any | null >;
    chathistory(userId1 : any , userId2:any):Promise<any | null>
    createPoll(polldetails:any):Promise<any | null>
    getAllPolls(page:number , limit :number):Promise<any | null>
    getUserPolls(userId:any):Promise<any | null>
    countAllPolls():Promise<any | null>
    deletePoll(pollid:string):Promise<any | null>
    updateProfilePicture(userId: string, s3Url: string): Promise<any>;
    updateUsername(userId: string, name: string): Promise<any>;
    updateStatusnew(userId: string): Promise<any>;

}


export {IuserService}