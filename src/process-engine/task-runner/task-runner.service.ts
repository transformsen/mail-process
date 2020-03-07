import { Injectable } from '@nestjs/common';
import { QueueWatcherService } from '../queue-watcher/queue-watcher.service';
import { Observable, zip, of, empty } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { TaskCreatorService } from '../task-creator/task-creator.service';
import { Task, TaskStatus } from 'src/model/task';
import { response } from 'express';
import { ProcessStatus } from 'src/model/process-status';
import { STATUS } from 'src/model/status';
import { MOCK_INFO } from 'src/util/util';
import { Item } from 'src/model/Job';
import { readFileSync, writeFile, appendFile, unlinkSync } from 'fs';
import { join } from 'path'

@Injectable()
export class TaskRunnerService {
    constructor(private queueWatcherService: QueueWatcherService,
        private taskCreatorService: TaskCreatorService){
        this.run()
    }
    watch$: Observable<any> = this.queueWatcherService.fileArrivalObservable();
    currentRunningMIB: string;

    /**
     * STEP 1: Add the current file to PRDNING JOB
     * STEP 2: Encode the file content to base64
     * STEP 3: Create TASKS using task creator (Observable)
     * STEP 4: Subscribe the Observable sream for triggering the process
     */

    run(){
        const processStatus : ProcessStatus = MOCK_INFO;
        processStatus.completionStatus = STATUS.PENDING
        processStatus.overallStatus = STATUS.PENDING
        processStatus.lastProcessingAttempt= new Date().toISOString()
        processStatus.requestedSendDate = new Date().getDate().toString()
        this.watch$.pipe(
            switchMap((file)=>{
                if(file == STATUS.ORPHAN){
                    return of(STATUS.ORPHAN)
                }
                console.log('Sub process in started processing a file =>', file)
                const encoded_content = Buffer.from(readFileSync(file)).toString('base64')
                const item: Item = {
                    contentType : file.split('.')[1],
                    content: encoded_content,
                    encodingType: 'base64'
                }
                processStatus.item = item;
                processStatus.name = file;
                const tasks: Task[] = this.taskCreatorService.create(encoded_content)
                const tasks$: Observable<any> [] = [];
                const taskNames: string [] = [];
                for(const task of tasks){
                    taskNames.push(task.taskName)
                    tasks$.push(task.task)
                }
                 
                return zip(...tasks$).pipe(map((statuses)=>{
                    const taskStatus = {}
                    for(const i in taskNames){
                        taskStatus[taskNames[i]] = statuses[i]
                    }
                    const taskAndOrder = {} as {taskNames:string[], tasks: any};
                    taskAndOrder['taskNames'] = taskNames;
                    taskAndOrder['tasks'] = taskStatus;
                    return taskAndOrder;
                }))
            })
        ).subscribe((response: any)=>{            
            
            if(response == STATUS.ORPHAN){
                processStatus.completionStatus = STATUS.COMPLETED
                processStatus.overallStatus = STATUS.ORPHAN
            }else{
                processStatus.completionStatus = STATUS.COMPLETED
                processStatus.overallStatus = STATUS.SUCCESS
                processStatus.taskOrder = response.taskNames;
                processStatus.task = response.tasks; 

                for(const task of response.taskNames){
                    const taskstatus = response.tasks[task] as TaskStatus;
                    if(taskstatus.overallStatus == STATUS.FAILURE){
                        processStatus.overallStatus = STATUS.FAILURE
                        break;
                    }
                }    
                if(processStatus.overallStatus == STATUS.SUCCESS){
                    unlinkSync(join(processStatus.name))
                }            
            }
            console.log('PROCESSING STAUTS IS ', JSON.stringify(processStatus, null, 100))            
        }, (error)=>{
            console.log('error', error)
        }, ()=>{
            console.log('Completed')
        })
    }
}
