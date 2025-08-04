import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorDocument } from 'src/lib/schemas/author.schema';
import { HaikuDocument } from 'src/lib/schemas/haiku.schema';

@Injectable()
export class HaikuService {
    constructor(
        @InjectModel('Haiku') private haikuModel: Model<HaikuDocument>,
        @InjectModel('Author') private authorModel: Model<AuthorDocument>,
    ) { }
}
