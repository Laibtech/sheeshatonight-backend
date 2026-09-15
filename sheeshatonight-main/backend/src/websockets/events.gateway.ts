import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    if (data && data.room) {
      client.join(data.room);
      return { event: 'joined_room', room: data.room };
    }
  }

  // Method to emit real-time order status updates
  emitOrderStatusUpdate(orderId: string, status: string, payload: any) {
    this.server.to(`order_${orderId}`).emit('order_status_updated', {
      orderId,
      status,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  // Method to emit vendor new order alert
  emitVendorNewOrder(vendorId: string, order: any) {
    this.server.to(`vendor_${vendorId}`).emit('vendor_new_order', {
      vendorId,
      order,
      timestamp: new Date().toISOString(),
    });
  }
}
