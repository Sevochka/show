import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '@/app/users/user.model';
import { UserNotifications } from '@/app/notifications/models/user-notifications.model';

@Table
export class Notification extends Model {
  @Column({
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @Column({
    type: DataType.STRING,
  })
  link: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPopsUp: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  popsUpTimeout: number;

  @BelongsToMany(() => User, {
    through: { model: () => UserNotifications, unique: false },
    onDelete: 'RESTRICT',
  })
  users: User[];

  @Column({
    type: DataType.JSON,
  })
  meta: JSON;
}
