import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user')
@ApiBearerAuth()
@Controller('profile')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Authenticated user profile.' })
  getProfile(@Req() req) {
    const { id, name, email } = req.user;
    return { id, name, email };
  }
}
