import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from 'src/model/Job';
import { JobDto } from 'src/model/job.dto';

@Injectable()
export class PostalService {
    constructor(@InjectModel('Job') private readonly jobModel: Model<Job>) {}

    async create(createjobDto: JobDto): Promise<Job> {
        const createdjob = new this.jobModel(createjobDto);
        return createdjob.save();
      }
    
      async findAll(): Promise<Job[]> {
        return this.jobModel.find().exec();
      }
}
