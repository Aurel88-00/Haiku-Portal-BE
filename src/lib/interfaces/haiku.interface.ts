import { Types } from "mongoose"
import { IAuthor } from "./author.interface";

export interface IHaiku{
   readonly _id?: Types.ObjectId;
   readonly title: string;
   readonly author: IAuthor |  Types.ObjectId | string ;
   readonly lines: string[];
   readonly originalLanguage?: string;
   readonly yearWritten: number;

}