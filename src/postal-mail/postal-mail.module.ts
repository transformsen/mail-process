import { Module } from '@nestjs/common';
import { PostalController } from './postal/postal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from 'src/schemas/job.schema';
import { PostalService } from './postal/postal.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }])],
  controllers: [PostalController],
  providers: [PostalService]
})
export class PostalMailModule {}
