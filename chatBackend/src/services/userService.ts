import { Ipolldetails, IUser, IUserdata } from "../interfaces/user.interface";

import bcrypt from 'bcryptjs'
import { IpollRepository, IUserRepository } from "../interfaces/user.repository.interface";
import { IuserService } from "../interfaces/user.service.interface";



export class UserService implements IuserService {


    constructor(private _userRepository: IUserRepository, private _pollRepository: IpollRepository) {

    }

    async registerUser(userdata: IUser) {

        try {
            const existingUser = await this._userRepository.findbyEmail(userdata.email)

            if (existingUser) {
                return { success: false, message: "user already exists" }
            }


            const hashPassword = await bcrypt.hash(userdata.password, 10)
            const newUser = await this._userRepository.createUser({
                name: userdata.name,
                email: userdata.email,
                password: hashPassword,
                phone: userdata.phone
            })

            console.log("newuser @services")

            return { success: true, message: "User Registered successfully", data: newUser }
        } catch (error) {
            console.error("Error in registerUser", error)
            throw new Error("Failed to register user")
        }
    }



    async loginUser(loginData: IUserdata) {

        try {

            const existingUser: any = await this._userRepository.findbyEmail(loginData.email)
            if (!existingUser) {
                console.log("no such user")
                return { success: false, message: 'Ivalid Email' }
            }

            const validpassword = await bcrypt.compare(loginData.password, existingUser.password)

            if (!validpassword) {
                return { success: false, message: "Invalid Password" };
            }

            await this._userRepository.updateStatus(existingUser._id, { status: true })

            const payload = { userId: existingUser._id, email: existingUser.email, name: existingUser.name }

            return {
                success: true,
                message: "Login Successfull",
                data: payload
            }


        } catch (error) {

            console.error("Error in loginUser service", error)
            throw new Error("Service error occured")
        }
    }


    async getCurrentuserDetails(userId: string) {
        try {
            return await this._userRepository.getCurrentUser(userId)
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;
        }
    }

    async searchUsers(searchterm: string, currentusername: string) {
        try {
            let kk = await this._userRepository.searchUsers(searchterm, currentusername)
            console.log("serachere", kk)
            return kk
        } catch (error) {
            console.error("Error in service searchUsers layer:", error);
            throw error;
        }
    }

    async allUsers(currentuserId: string) {
        try {
            let kk = await this._userRepository.allUsers(currentuserId)
            console.log("serachere", kk)
            return kk
        } catch (error) {
            console.error("Error in service allUsers layer:", error);
            throw error;
        }
    }

    async chathistory(userId1: any, userId2: any) {
        try {
            let messages = await this._userRepository.chathistory(userId1, userId2)
            return messages
        } catch (error) {
            console.error("Error in service chathistory layer:", error);
            throw error;
        }
    }


    async createPoll(polldetails: Ipolldetails) {
        try {


            console.log("@userservice", polldetails)
            polldetails.options = polldetails.options.map((opt: any) => ({
                text: opt.text,
                votes: 0  // Default votes to 0
            }));
            const savedata = await this._pollRepository.createPoll(polldetails)
            return savedata

        } catch (error) {
            console.error("error@service", error)
        }
    }


    async getAllPolls(page: number, limit: number) {
        try {


            const offset = (page - 1) * limit
            const polldata = await this._pollRepository.getallPolls(limit, offset)
            return polldata

        } catch (error) {
            console.error("Error in service getAllPolls layer:", error);
            throw error;
        }
    }

    async getUserPolls(userId: string) {
        try {


            const polldata = await this._pollRepository.getUserPolls(userId)
            return polldata


        } catch (error) {
            console.error("error@service", error)
            throw error;
        }
    }


    async countAllPolls() {
        try {

            return await this._pollRepository.countPoll()

        } catch (error) {
            console.error("error@service", error)
            throw error;
        }
    }


    async deletePoll(pollid: string) {
        try {


            const poll = await this._pollRepository.deletePoll(pollid)

            if (!poll) {
                throw new Error(`Poll with ID ${pollid} not found`);

            }

            return poll

        } catch (error) {
            console.error("error@service", error)
            throw error;
        }
    }


    async updateProfilePicture(userId: string, s3Url: string): Promise<any> {
        try {
            const updatedUser = await this._userRepository.updateProfilePic(userId, { profileImage: s3Url });
            return updatedUser;
        } catch (error) {
            throw new Error('Error updating profile image');
        }
    }


    async updateUsername(userId: string, name: string): Promise<any> {
        try {
            const updatedUser = await this._userRepository.updateName(userId, { name: name });
            return updatedUser;
        } catch (error) {
            throw new Error('Error updating profile image');
        }
    }

    async updateStatusnew(userId: string): Promise<any> {
        try {
            const updatedUser = await this._userRepository.updateStatusnew(userId, { status: false });
            return updatedUser;
        } catch (error) {
            throw new Error('Error updating profile image');
        }
    }

}