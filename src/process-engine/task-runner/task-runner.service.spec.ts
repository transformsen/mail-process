import { Test, TestingModule } from '@nestjs/testing';
import { TaskRunnerService } from './task-runner.service';

describe('TaskRunnerService', () => {
  let service: TaskRunnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskRunnerService],
    }).compile();

    service = module.get<TaskRunnerService>(TaskRunnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
