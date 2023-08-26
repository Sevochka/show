import { Controller, Get, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '@/core/decorators/user.decorator';
import { User as UserAuth } from '@/core/utils/cyber-auth';
import { NotificationsService } from '@/app/notifications/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiOkResponse({ description: 'User notifications' })
  async get(@User() user: UserAuth): Promise<any> {
    const userNotifications =
      await this.notificationsService.getUserNotifications(user.id);

    return userNotifications;
  }

  @Patch()
  @ApiOperation({ summary: 'Mark all users notifications as seen' })
  async markAllAsSeen(@User() user: UserAuth): Promise<any> {
    await this.notificationsService.markAllAsSeen(user.id);
    return { message: 'success' };
  }
}
