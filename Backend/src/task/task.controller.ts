import { Controller, Post, Get, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskService } from './task.service';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @ApiBody({ schema: { properties: { name: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Task created.' })
  async create(@Req() req, @Body('name') name: string) {
    return this.taskService.createTask(req.user.id, name);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'archived', required: false })
  @ApiResponse({ status: 200, description: 'List of tasks.' })
  async findAll(
    @Req() req,
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('archived') archived: string = 'false',
  ) {
    return this.taskService.getTasks(
      req.user.id,
      search,
      Number(page) || 1,
      Number(limit) || 10,
      archived === 'true'
    );
  }

  @Patch(':id')
  @ApiBody({ schema: { properties: { status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] } } } })
  @ApiResponse({ status: 200, description: 'Task status updated.' })
  async updateStatus(@Req() req, @Param('id') id: string, @Body('status') status: string) {
    return this.taskService.updateTaskStatus(req.user.id, id, status);
  }

  @Patch(':id/archive')
  @ApiResponse({ status: 200, description: 'Task archived.' })
  async archive(@Req() req, @Param('id') id: string) {
    return this.taskService.archiveTask(req.user.id, id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Task deleted.' })
  async delete(@Req() req, @Param('id') id: string) {
    return this.taskService.deleteTask(req.user.id, id);
  }
}
