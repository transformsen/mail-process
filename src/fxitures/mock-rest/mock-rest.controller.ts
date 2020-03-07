import { Controller, Post } from '@nestjs/common';

/**
 * MOCK controllers for upload and fire event
 */
@Controller()
export class MockRestController {

    @Post('/documents/upload')
    upload(){
        if(Math.random()*10 > 3){
            return 'File has been successfully stored in DMS!'
        }else{
            throw ('Storage failure Error..')
        }
    }

    @Post('/event')
    event(){
        if(Math.random()*10 > 3){
            return 'Event Has been successfull sent'
        }else{
            throw ('Problem while processing!')
        }
    }
}
