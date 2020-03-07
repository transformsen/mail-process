import { Module, HttpModule } from '@nestjs/common';
import { TaskRunnerService } from './task-runner/task-runner.service';
import { TaskCreatorService } from './task-creator/task-creator.service';
import { UploadService } from './upload/upload.service';
import { EventService } from './event/event.service';
import { DirectoryWatcherService } from './queue-watcher/directory-watcher/directory-watcher.service';
import { QueueWatcherService } from './queue-watcher/queue-watcher.service';

@Module({
  imports: [HttpModule],
  providers: [TaskRunnerService, TaskCreatorService, UploadService, EventService,
    {provide: QueueWatcherService, useClass: DirectoryWatcherService}]
})
export class ProcessEngineModule {}
