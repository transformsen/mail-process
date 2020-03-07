import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export abstract class QueueWatcherService {
    abstract fileArrivalObservable(): Observable<any>;
}
