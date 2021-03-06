### Build and Run
* npm i
* npm run start:dev

### Instructions on how to configure the API/processor
#### API
* Update the DB details in .development.env file. (I have tested with my mongo and but disabled password)
* uncomment and comment the uri in app.module.ts
* Swagger - http://localhost:3000/api - (POST Job)
#### Process
* Process will automatically start when you start the server.
* Place any file inside the ./watch directory of the current folder. I placed one file for running it default.
* I have introduced error in mock for testing the retry logic. On console logs you can see error and retry information.

### Instructions on how to verify
#### API
* Swagger - http://localhost:3000/api - (GET Job). See the created job here
#### Process
* When you add new file to the ./watch Directory, it will trigger the workflow and output will display on console.

### Design details
| Design Key | Design Details |
| ----- | ---- |
| Model | All the model files are under modle directory |
| Stream | Stream and RXJS reactive concepts are used for processing and work flow |
| Watcher (MSQ) | QueueWatcher is the abstract class. DirectoryWatcher is the implementation. Incase of AWS implementation, just implement the contract for QueueWatcher and update it on app.module - providers |
| Job Runner (COMPDB) | This service is responsible for running the workflow/tasks in give order asynchronosly | 
| Job Creater | Create the tasks blue print. Any new jobs can be added here. It will be used by Job runner |
| Upload/Event | Upload and Event service will do their respective jobs and handles the retry and recording appempts it made |
| Job/API | postal-mail folder contains the implementation for API and uploading to mongo |
| Queue | In furtur it can be changed to AWS or Kafka or others by implementing the contarct of Queue watcher. No to change any thing task run or workflow |
| ENV Variables | All the env variable are loaded using the config service |
| RX-Js Operators | Stream are the core concept of this implementation asyn, retry, error handle, map are implemented using RXjs Operators |

