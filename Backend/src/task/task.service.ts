import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, name: string) {
    return this.prisma.task.create({
      data: { name, userId },
    });
  }

  async getTasks(userId: string, search?: string, page: number = 1, limit: number = 10, archived: boolean = false) {
    const where: any = {
      userId,
      archived,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };
    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ])
    return { tasks, total };
  }

  async updateTaskStatus(userId: string, id: string, status: string) {
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    return this.prisma.task.updateMany({
      where: { id, userId },
      data: { status },
    });
  }

  async deleteTask(userId: string, id: string) {
    return this.prisma.task.deleteMany({
      where: { id, userId },
    });
  }

  async archiveTask(userId: string, id: string) {
    return this.prisma.task.updateMany({
      where: { id, userId },
      data: { archived: true },
    });
  }
}
