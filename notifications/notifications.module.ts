import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { getUser } from '@/core/middleware/user';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationsService } from '@/app/notifications/notifications.service';
import { NotificationsController } from '@/app/notifications/notifications.controller';
import { UserNotifications } from '@/app/notifications/models/user-notifications.model';
import { Notification } from '@/app/notifications/models/notification.model';
import { NotificationsGateway } from '@/app/notifications/notifications.gateway';

@Module({
  imports: [SequelizeModule.forFeature([Notification, UserNotifications])],
  providers: [NotificationsGateway, NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(getUser).forRoutes(NotificationsController);
  }
}
