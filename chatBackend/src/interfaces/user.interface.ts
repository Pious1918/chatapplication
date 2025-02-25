export interface IUser{
    name:string;
    email:string;
    phone:string;
    password:string;
    status?:boolean;
    profileImage?:string

}

export interface IUserdata{
    
    email:string;
    password:string;

}

export interface IusePayload{
    _id?:any,
    userId:string,
    name:string,
    email:string
}



export interface PollOption {
    text: string;
    votes?: number; // Optional since default is 0
  }

export interface Ipolldetails{
    _id?:string,
    creatorId?:string
    question:string,
    options:PollOption[]
    createdAt?:Date
}