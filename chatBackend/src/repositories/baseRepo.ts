import { FilterQuery, Model } from "mongoose";

export class BaseRepository<T extends Document>{

    private _model: Model<T>

    constructor(model: Model<T>){
        this._model=model
    }


    async save(item:Partial<T>):Promise<T | null>{
        const newItem = new this._model(item)

        return await newItem.save()
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this._model.findOne(filter)
    }

    async findById(id: string): Promise<T | null> {
        return this._model.findById(id).exec();
    }

    async find(filter?: Partial<T> | undefined): Promise<T[]> {
        return this._model.find()
    }


    async findWithPagination( limit: number, offset: number): Promise<T[]> {
        return await this._model
            .find()
            
            .skip(offset)
            .limit(limit)
            .exec();
    }
    
    async countDocuments(): Promise<number> {
        return await this._model.countDocuments().exec();
    }


    async deleteById(id: string):  Promise<T | null> {
        return await this._model.findByIdAndDelete(id);
    }


    async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
        return await this._model.findByIdAndUpdate(id, updateData, { new: true });
    }
}