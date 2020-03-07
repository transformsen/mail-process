import { RequestContext, Recipient, Item } from "./Job";

export interface ProcessStatus{
    version?: string
    requestContext?: RequestContext
    id?: string
    created?: string
    name?: string
    completionStatus?: string
    overallStatus?: string
    lastProcessingAttempt?: string
    requestedSendDate?: string
    recipient?:Recipient
    item?: Item
    taskOrder?: any[]
    task?: any
    
}



