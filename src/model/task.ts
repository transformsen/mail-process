import { Observable } from 'rxjs';

export interface Task{
    taskName: string
    task: Observable<any>
}

export interface TaskStatus{
    completionStatus: string
    overallStatus: string
    lastProcessingAttempt: string
    attempts: any[]
}

export interface AttemptError{
    time: string
    status: string
    retryableStatus: boolean,
    errorDetails: ErrorDetails
}

export interface AttemptSuccess{
    time: string
    status: string
    successDetails: SuccessDetails
}

export interface ErrorDetails{
    name: string
    message: string
    details: string
}

export interface SuccessDetails{
    details: string
}