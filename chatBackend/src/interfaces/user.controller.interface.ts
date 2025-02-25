import { Request, Response } from "express";
import IAuthRequest from "../middleware/authMiddleware";



export interface IuserController{
    registerUser(req:Request , res:Response):Promise<void>,
    loginUser(req: Request, res: Response): Promise<void>;
    getCurrentuser(req: IAuthRequest , res:Response ): Promise<void>;
    getSelectuser(req: IAuthRequest , res:Response ): Promise<void>;
    searchUsers(req:IAuthRequest, res:Response):Promise<void>
    allusers(req:IAuthRequest, res:Response):Promise<void>
    chathistory(req:IAuthRequest, res:Response):Promise<void>
    createPoll(req:IAuthRequest, res:Response):Promise<void>
    getAllpolls(req:IAuthRequest, res:Response):Promise<void>
    getuserpolls(req:IAuthRequest, res:Response):Promise<void>
    deletePoll(req:IAuthRequest, res:Response):Promise<void>
    genPresignedURL(req:Request, res:Response):Promise<void>
    updateProfileImage(req: IAuthRequest, res: Response): Promise<void>;
    updatename(req: IAuthRequest, res: Response): Promise<void>;
    updateStatusnew(req: IAuthRequest, res: Response): Promise<void>;

}