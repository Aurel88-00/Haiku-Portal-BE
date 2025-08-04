import { Types } from "mongoose"

export interface IAuthor{
   readonly _id: Types.ObjectId;
   readonly name: string;
   readonly bio: string;
   readonly birthYear?: number;
   readonly deathYear?: number;
   readonly nationality?: string;
   readonly era?: string;
   readonly haikus?: string[];

}