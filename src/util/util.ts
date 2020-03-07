import { TaskStatus, AttemptError, ErrorDetails } from "src/model/task";
import { Observable, throwError, timer, of } from "rxjs";
import { STATUS } from "src/model/status";
import { mergeMap } from "rxjs/operators";

export const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 50,
  uploadStatus = {}
}: {
  maxRetryAttempts?: number,
  scalingDuration?: number
  uploadStatus?: TaskStatus | any
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const errorDetails: ErrorDetails = {
        name: error.name,
        message: error.message,
        details: error.message
      }
      const attemptError: AttemptError = {
        time: new Date().toISOString(),
        status: STATUS.FAILURE,
        retryableStatus: true,
        errorDetails: errorDetails
      }
      if (!uploadStatus.attempts) {
        uploadStatus.attempts = []
      }
      uploadStatus.lastProcessingAttempt = new Date().toISOString()
      uploadStatus.overallStatus = STATUS.FAILURE
      uploadStatus.completionStatus = STATUS.RETRY
      uploadStatus.attempts.push(attemptError)

      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts) {
        console.log('Maximum retry limit reached...')
        attemptError.retryableStatus = true
        return throwError(error);
      } else {
        attemptError.retryableStatus = true
      }
      console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
      return timer(retryAttempt * scalingDuration);
    })
  );
};


export const genericErrorHandle = (uploadStatus, error) => {
  const errorDetails: ErrorDetails = {
    name: error.name,
    message: error.message,
    details: error.message
  }
  const attemptError: AttemptError = {
    time: new Date().toISOString(),
    status: STATUS.FAILURE,
    retryableStatus: false,
    errorDetails: errorDetails
  }
  uploadStatus.lastProcessingAttempt = new Date().toISOString()
  uploadStatus.overallStatus = STATUS.FAILURE
  uploadStatus.completionStatus = STATUS.COMPLETED
  if (!uploadStatus.attempts) {
    uploadStatus.attempts = []
  }
  uploadStatus.attempts.push(attemptError)
  return of(uploadStatus);
}

export const MOCK_INFO = {
  version: "1",
  requestContext: {
    source: {
      system: {
        name: "some-app-or-api",
        version: "1.0",
        stagingEnvironment: "DEV",
        datacenterEnvironment: "AWS"
      },
      user: {
        id: "bob1234"
      }
    }
  },
  id: "310d58ad-aa25-409e-9135-12a7f48b95d4",
  created: "2020-02-11T15:05:07+0000",
  name: "CIM_DEV_B-9619649_IOI4444444-1581447907",
  completionStatus: "COMPLETE",
  overallStatus: "SUCCESS",
  lastProcessingAttempt: "2020-02-11T19:15:07+0000",
  requestedSendDate: "2020-02-11",
  recipient: {
    addressee: "JON GRUDEN",
    addressLine1: "3333 Al Davis Way",
    addressLine2: "",
    city: "Las Vegas",
    state: "NV",
    zip: "89118",
    zip4: ""
  },
} 