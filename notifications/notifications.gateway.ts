import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, OnModuleInit } from '@nestjs/common';
import { getUserByUnparsedCookie } from '@/core/utils/cyber-auth';
import { NotificationsService } from '@/app/notifications/notifications.service';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: '/notifications',
  cors: {
    // ToDo установить верные корсы
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  onModuleInit() {}

  async handleConnection(client: Socket) {
    const user = await getUserByUnparsedCookie(client.handshake.headers.cookie);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data = {
      ...client.data,
      userId: user.id,
      clientId: client.id,
    };

    this.notificationsService.handleConnection({
      userId: user.id,
      clientId: client.id,
    });
  }

  public async getActiveUsers() {
    const activeSockets = await this.server.fetchSockets();
    return activeSockets.map((socket) => socket.data);
  }

  public async sendNotificationIfUserOnline(userId: number, payload: any) {
    const activeSockets = await this.server.fetchSockets();
    const userSockets = activeSockets.filter(
      (socket) => socket.data.userId === userId,
    );
    userSockets.forEach((socket) => socket.emit('message', payload));
  }
}
