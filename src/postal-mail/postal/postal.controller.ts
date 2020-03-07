import { Controller, Body, Post, Get, HttpCode } from '@nestjs/common';
import { PostalService } from './postal.service';
import { JobDto } from 'src/model/job.dto';
import { Job } from 'src/model/Job';
import { ApiBody } from '@nestjs/swagger';
import { response } from 'express';

/**
 * Posting end retriving job data
 */
@Controller('job')
export class PostalController {
    constructor(private readonly postalService: PostalService) {}

  @Post()
  @ApiBody({ type: JobDto })
  @HttpCode(200)
  async create(@Body() createJobDto: JobDto) {
    const resp =  await this.postalService.create(createJobDto) as any;
    return resp._id;
  }

  @Get()
  async findAll(): Promise<Job[]> {
    return this.postalService.findAll();
  }
}
