import { Test, TestingModule } from '@nestjs/testing';
import { QueueWatcherService } from './queue-watcher.service';

describe('QueueWatcherService', () => {
  let service: QueueWatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueWatcherService],
    }).compile();

    service = module.get<QueueWatcherService>(QueueWatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
