import { Types } from "mongoose"

export interface IHaiku{
   readonly _id: Types.ObjectId;
   readonly title: string;
   readonly author: string;
   readonly lines: string[];
   readonly originalLanguage?: string;
   readonly yearWritten: number;

}