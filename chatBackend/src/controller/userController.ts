import { Request, Response } from "express";
import { Ipolldetails, IUser, IUserdata } from "../interfaces/user.interface";
import { IuserService } from "../interfaces/user.service.interface";
import { IuserController } from "../interfaces/user.controller.interface";
import { generateToken } from "../utils/jwtHelper";
import { StatusCode } from "../enums/statuscode.enums";
import IAuthRequest from "../middleware/authMiddleware";
import { generatepresigned } from "../utils/genPresigned";
import mongoose from "mongoose";



export class userController implements IuserController {


  constructor(private _userservice: IuserService) {

  }


  public registerUser = async (req: Request, res: Response) => {

    try {
      const { name, email, phone, password } = req.body
      const userData: IUser = {
        name: name,
        email: email,
        password: password,
        phone: phone
      }

      console.log("userdatat is ", userData)

      const result = await this._userservice.registerUser(userData)

      if (result.success) {
        res.status(200).json({ success: true, message: result.message, data: result.data })
      } else {
        res.status(400).json({ success: false, message: result.message })
      }

    } catch (error) {
      console.error("Error registering the user:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }


  public loginUser = async (req: Request, res: Response): Promise<void> => {

    try {

      const { email, password } = req.body.loginData
      const userData: IUserdata = {
        email: email,
        password: password
      }
      const result = await this._userservice.loginUser(userData)

      if (!result.success) {
        res.status(StatusCode.BadRequest).json({ message: result.message })
      }
      else {
        const token = generateToken({ userId: result.data?.userId, name: result.data?.name, email: result.data?.email })
        res.status(StatusCode.OK).json({ success: result.success, message: result.message, token })
      }

    } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(StatusCode.InternalServerError).json({ message: "An error occurred" });
    }
  }

  public getCurrentuser = async (req: IAuthRequest, res: Response): Promise<void> => {

    try {
      const userId = req.user?.userId

      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }

      const currentUser = await this._userservice.getCurrentuserDetails(userId)
      res.json({ success: true, data: currentUser });


    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });
    }
  }

  public getSelectuser = async (req: IAuthRequest, res: Response): Promise<void> => {

    try {

      let selectedUser = req.params.userid

      console.log("slet", selectedUser)
      // Remove unexpected characters and validate ObjectId
      selectedUser = selectedUser.replace(":", ""); // Remove unwanted colon if present
      if (!mongoose.Types.ObjectId.isValid(selectedUser)) {
        res.status(400).json({ success: false, message: "Invalid user ID format" });
      }

      const currentUser = await this._userservice.getCurrentuserDetails(selectedUser)
      res.json({ success: true, data: currentUser });


    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });
    }
  }


  public searchUsers = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {
      const searchterm = req.query.query as string;
      const currenusername = req.user?.userId
      const users = await this._userservice.searchUsers(searchterm, currenusername)
      res.json({ data: users });

    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });

    }
  }

  public allusers = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {

      const currenusername = req.user?.userId
      console.log("@controller cureent userid", currenusername)
      const users = await this._userservice.allUsers(currenusername)
      res.json({ data: users });

    } catch (error) {
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });

    }
  }

  public chathistory = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {
      const { userId1, userId2 } = req.params;
      console.log("curren", req.user?.userId)
      console.log("get history", userId1)
      console.log("receiver", userId2)
      const result = await this._userservice.chathistory(userId1, userId2)
      console.log("chat history", result)
      res.status(200).json({ message: 'all chats', chats: result })
    } catch (error) {
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });

    }
  }

  public createPoll = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {

      const currentUser = req.user?.userId
      const { question, options } = req.body
      console.log("opp", options)
      console.log("ques", question)
      const polldata: Ipolldetails = {
        question,
        options,
        creatorId: currentUser

      }

      const newPoll = await this._userservice.createPoll(polldata)


      console.log("Polls ", newPoll)
      res.status(StatusCode.OK).json({ success: true, message: "Poll created successfully", data: newPoll })



    } catch (error) {
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });

    }
  }


  public getAllpolls = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {


      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5

      const allPoll = await this._userservice.getAllPolls(page, limit)
      const totalPolls = await this._userservice.countAllPolls()
      const totalPages = Math.ceil(totalPolls / limit)
      console.log("total", totalPolls)

      console.log("Polls ", allPoll)
      res.status(StatusCode.OK).json({ success: true, message: "Poll fetched successfully", data: allPoll, totalPages, currentpage: page })



    } catch (error) {
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });

    }
  }


  public getuserpolls = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {



      const currentuser = req.user?.userId
      console.log("currentuserid", currentuser)
      const userPolls = await this._userservice.getUserPolls(currentuser)

      console.log("Polls ", userPolls)
      res.status(StatusCode.OK).json({ success: true, data: userPolls })



    } catch (error) {
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });

    }
  }


  public deletePoll = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {


      const pollId = req.params.pollid.startsWith(':')
        ? req.params.pollid.slice(1)
        : req.params.pollid;

      if (!pollId) {
        res.status(StatusCode.BadRequest).json({ success: false, message: 'Poll ID is required' });
        return;
      }


      console.log("Polls ", pollId)

      await this._userservice.deletePoll(pollId)
      res.status(StatusCode.OK).json({ success: true, message: `poll with ID ${pollId} deleted successfully` });



    } catch (error) {
      res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });

    }
  }



  public genPresignedURL = async (req: Request, res: Response) => {
    const { fileName, fileType } = req.body
    try {
      const presignedURL = await generatepresigned(fileName, fileType)
      res.json({ presignedURL })
    } catch (error) {
      console.error("Error in presignedurl:", error);
      res.status(StatusCode.InternalServerError).json({ message: "An error occurred" });
    }
  }


  public updateProfileImage = async (req: IAuthRequest, res: Response) => {
    const { s3Url } = req.body;
    try {

      const userId = req.user?.userId;

      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }

      const updateUser = await this._userservice.updateProfilePicture(userId, s3Url)
      res.status(StatusCode.OK).json({ success: true });
    } catch (error: any) {
      console.error('Error updating story:', error.message);
      res.status(StatusCode.InternalServerError).json({ success: false, message: error.message });
    }
  };


  public updatename = async (req: IAuthRequest, res: Response) => {
    const { name } = req.body;
    try {

      const userId = req.user?.userId;

      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }

      const updateUser = await this._userservice.updateUsername(userId, name)
      res.status(StatusCode.OK).json({ success: true });
    } catch (error: any) {
      console.error('Error updating story:', error.message);
      res.status(StatusCode.InternalServerError).json({ success: false, message: error.message });
    }
  };


  public updateStatusnew = async (req: IAuthRequest, res: Response) => {

    try {

      const userId = req.user?.userId;

      if (!userId) {
        res.status(StatusCode.NotFound).json({ message: 'No such user' })
        return
      }

      const updateUser = await this._userservice.updateStatusnew(userId)
      res.status(StatusCode.OK).json({ success: true });
    } catch (error: any) {
      console.error('Error updating story:', error.message);
      res.status(StatusCode.InternalServerError).json({ success: false, message: error.message });
    }
  };

}