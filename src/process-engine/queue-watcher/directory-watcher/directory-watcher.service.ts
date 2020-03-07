import { Injectable } from '@nestjs/common';
import { QueueWatcherService } from '../queue-watcher.service';
import { Subject, Observable, timer, interval } from 'rxjs';
import { watch } from 'chokidar'
import { readdir, readFile } from 'fs';
import { STATUS } from 'src/model/status';
import { ConfigService } from '@nestjs/config';

/**
 * This service will act as a MSQ. 
 * Queue need to extend QueueWatcherService
 */
@Injectable()
export class DirectoryWatcherService extends QueueWatcherService{

    private watcherSubject: Subject<any> = new Subject<any>()
    private watch$: Observable<any> = this.watcherSubject.asObservable();

    constructor(private readonly configService: ConfigService){
        super()
        this.start()
    }

    start(){
        const spantime = this.configService.get<number>('WM_OMP_TASK_PROCESSING_SPAN_MINUTES');
       //Watcher secheduler can be implemented using observable => interval operator
       //Here is it implemented to watch file on add to the queue. Forusing power of stream processing 
        watch('./watch').on('add', (file)=>{
            this.watcherSubject.next(file)
        })        
    }

    fileArrivalObservable(): Observable<any>{
        return this.watch$;
    }
}
