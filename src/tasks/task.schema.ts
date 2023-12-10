import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatus } from './task.model';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;
@Schema({ discriminatorKey: 'id' })
export class Task {
  @Prop({
    type: String,
    unique: true,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop()
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
