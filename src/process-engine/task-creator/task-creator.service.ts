import { Injectable } from '@nestjs/common';
import { UploadService } from '../upload/upload.service';
import { EventService } from '../event/event.service';
import { Task } from 'src/model/task';

@Injectable()
export class TaskCreatorService {
    constructor(private uploadService: UploadService,
        private eventService: EventService){

        }

        /**
         * Create TASK for give file
         * Any New task can be added here.
         * Invocation has been abstracted in Task Runner
         */
    
        create(fileContent): Task[]{
            return [
                {taskName: 'UPLOAD_TO_DMS', task: this.uploadService.upload(fileContent)},
                {taskName: 'FIRE_EVENT_POSTAL_MAIL_SENT', task: this.eventService.fire(fileContent)}
            ]
        }
}
