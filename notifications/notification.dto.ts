import { ApiProperty } from '@nestjs/swagger';

class SendNotificationDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  notificationId: number;

  @ApiProperty()
  metaData: string;

  @ApiProperty()
  image: string;
}

export { SendNotificationDto };
