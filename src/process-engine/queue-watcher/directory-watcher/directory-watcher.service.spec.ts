import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryWatcherService } from './directory-watcher.service';

describe('DirectoryWatcherService', () => {
  let service: DirectoryWatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectoryWatcherService],
    }).compile();

    service = module.get<DirectoryWatcherService>(DirectoryWatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
