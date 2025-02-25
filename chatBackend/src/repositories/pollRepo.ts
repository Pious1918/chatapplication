import { Ipolldetails, IUser } from "../interfaces/user.interface";
import pollModel from "../models/pollModel";
import { BaseRepository } from "./baseRepo";


export class pollRepository extends BaseRepository<any> {

    constructor() {
        super(pollModel)
    }

    async createPoll(polldetails: Partial<Ipolldetails>): Promise<Ipolldetails | null> {
        console.log("new poll at repo", polldetails)
        return this.save(polldetails)
    }


    async getallPolls(limit: number, offset: number): Promise<any | null> {

        return await this.findWithPagination(limit, offset)
    }


    async getUserPolls(userid: any): Promise<any | null> {

        return await pollModel.find({ creatorId: userid })
    }


    async countPoll(): Promise<any | null> {

        return await this.countDocuments()
    }

    async deletePoll(pollid: string): Promise<any | null> {

        return await this.deleteById(pollid)
    }




}