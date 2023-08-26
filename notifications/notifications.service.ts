import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserNotifications } from '@/app/notifications/models/user-notifications.model';
import { Notification } from '@/app/notifications/models/notification.model';
import { SendNotificationDto } from '@/app/notifications/notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,

    @InjectModel(UserNotifications)
    private userNotificationsModel: typeof UserNotifications,

    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  // Вызывается из NotificationsGateway на каждое подключение пользователя
  async handleConnection({
    userId,
    clientId,
  }: {
    userId: number;
    clientId: string;
  }) {
    const userNotificationsToPopsUp =
      await this.getUserNotificationsForPopUp(userId);

    userNotificationsToPopsUp.map((userNotification) => {
      // ToDo send notification to client. and handle timer on client side
      this.notificationsGateway.sendNotificationIfUserOnline(
        userId,
        userNotification,
      );
    });
  }

  async getActiveUsers() {
    return this.notificationsGateway.getActiveUsers();
  }

  async getUserNotificationsForPopUp(userId: number) {
    // where Notification popsUp = true
    const userNotifications = await this.userNotificationsModel.findAll({
      where: {
        userId,
        isSeen: false,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Notification,
          where: { isPopsUp: true },
        },
      ],
    });

    return userNotifications;
  }

  async getUserNotifications(userId: number) {
    const userNotifications = await this.userNotificationsModel.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
      include: [Notification],
    });

    return userNotifications;
  }

  async markAllAsSeen(userId: number) {
    await this.userNotificationsModel.update(
      { isSeen: true },
      {
        where: {
          userId,
        },
      },
    );
  }

  async addNotificationToUser({
    userId,
    notificationId,
    metaData,
    image,
  }: SendNotificationDto) {
    const userNotification = await this.userNotificationsModel.create({
      userId,
      notificationId,
      metaData,
      image,
    });

    await this.notificationsGateway.sendNotificationIfUserOnline(
      userId,
      userNotification,
    );

    return userNotification;
  }
}
