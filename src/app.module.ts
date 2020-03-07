import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessEngineModule } from './process-engine/process-engine.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockRestController } from './fxitures/mock-rest/mock-rest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostalMailModule } from './postal-mail/postal-mail.module';

@Module({
  imports: [ProcessEngineModule, ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true
    }),
    PostalMailModule,    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        //uri: `mongodb+srv://${configService.get('WM_OMP_DATASTORE_USER')}:${configService.get('WM_OMP_DATASTOE_PASSWORD')}@${configService.get('WM_OMP_DATASTORE_HOST')}/${configService.get('WM_OMP_DATASTORE_DB_NAME')}`,
        uri: `mongodb+srv://${configService.get('WM_OMP_DATASTORE_HOST')}/${configService.get('WM_OMP_DATASTORE_DB_NAME')}`,        
      }),
      inject: [ConfigService],
    }),  
  ],
  controllers: [AppController, MockRestController],
  providers: [AppService],
})
export class AppModule {}
