import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@/app/users/user.model';
import { Notification } from '@/app/notifications/models/notification.model';

@Table
export class UserNotifications extends Model {
  @Column({
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;

  @BelongsTo(() => Notification, {
    foreignKey: 'notificationId',
  })
  notification: Notification;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @ForeignKey(() => Notification)
  @Column({
    type: DataType.INTEGER,
  })
  notificationId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isSeen: boolean;
}
