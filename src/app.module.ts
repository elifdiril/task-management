import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TasksModule,
    MongooseModule.forRoot(
      'mongodb+srv://elif:PW@cluster0.ehz8iuk.mongodb.net/',
      {
        dbName: 'task-management',
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}