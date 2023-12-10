import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema'; // Ensure you have the correct Task schema imported
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskModel.find();
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let query = {};

    if (status) {
      query = { ...query, status }; // Add status to the query if provided
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } }, // Case-insensitive search on title
          { description: { $regex: search, $options: 'i' } }, // Case-insensitive search on description
        ],
      };
    }

    return await this.taskModel.find(query);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskModel.findById(id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new this.taskModel({
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    });
    return await task.save();
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.taskModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const updatedTask = await this.taskModel
      .findOneAndUpdate({ id: id }, { status }, { new: true })
      .exec();

    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }

    return updatedTask;
  }
}
