import { Injectable, HttpService } from '@nestjs/common';
import { UploadRequest } from 'src/model/upload-document';
import { ConfigService } from '@nestjs/config';
import { Observable, of, throwError, timer } from 'rxjs';
import { TaskStatus, ErrorDetails, AttemptError, SuccessDetails, AttemptSuccess } from 'src/model/task';
import { STATUS } from 'src/model/status';
import { retry, catchError, map, tap, retryWhen, mergeMap, finalize } from 'rxjs/operators';
import { genericRetryStrategy, genericErrorHandle } from 'src/util/util';

@Injectable()
export class UploadService {
   
    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService){}

    /**
     * Service handling the upload to API
     */
    upload(fileContent: string): Observable<any> {
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
        
        return this.httpService.post(`${uploadUrl}/documents/upload`, uploadRequest)
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
