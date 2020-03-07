import { Injectable, HttpService } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { STATUS } from 'src/model/status';
import { ErrorDetails, AttemptError, SuccessDetails, AttemptSuccess, TaskStatus } from 'src/model/task';
import { catchError, map, retryWhen } from 'rxjs/operators';
import { genericRetryStrategy, genericErrorHandle } from 'src/util/util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventService {
    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService){}

    /**
     * Service responsible for firing event
     */    
    fire(fileContent: any): Observable<any> {
        const uploadUrl = this.configService.get<string>('WM_OMP_ROOT_URI_DMS');
        const retryLimit = this.configService.get<number>('WM_OMP_PROCESSING_ATTEMPTS_MAX');
        const scaleTime = this.configService.get<number>('WM_OMP_PROCESSING_ATTEMPTS_SCALE');

        const uploadStatus: TaskStatus = {
            completionStatus: STATUS.PENDING,
            overallStatus: STATUS.INPROGRESS,
            lastProcessingAttempt: new Date().toISOString(),
            attempts: []
        }

    
        const uploadRequest:any[] = [{
            file: fileContent
        }]
        return this.httpService.post(`${uploadUrl}/event`, uploadRequest)
                .pipe(                    
                    retryWhen(genericRetryStrategy(
                        {maxRetryAttempts: retryLimit,
                        scalingDuration: scaleTime,
                        uploadStatus: uploadStatus}
                    )),                 
                    map((response)=>{
                        uploadStatus.completionStatus = STATUS.COMPLETED
                        uploadStatus.overallStatus = STATUS.SUCCESS
                        if(!uploadStatus.attempts){
                            uploadStatus.attempts = []
                        }
                        const successDetails: SuccessDetails = {details: response.data}
                        const sccuessAttempt:  AttemptSuccess = {
                            time: new Date().toISOString(),
                            status: STATUS.SUCCESS,
                            successDetails: successDetails
                        }
                        uploadStatus.attempts.push(sccuessAttempt)
                        return uploadStatus
                    }),
                    catchError((error)=>{           
                        return genericErrorHandle(uploadStatus, error)
                    }))
    }    
}
