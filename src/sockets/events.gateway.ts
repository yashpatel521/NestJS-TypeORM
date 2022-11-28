import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { ConnectedSocket } from "@nestjs/websockets/decorators";
import { Server, Socket } from "socket.io";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway {
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("login")
  async login(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const user = await this.userService.findByEmail(data.email);

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      this.sendMessage("login", client.id, {
        success: false,
      });
    } else {
      // update user socket id
      user.socketId = client.id;
      await this.userService.save(user);

      // remove password from user object
      const { password, ...result } = user;

      this.sendMessage("login", client.id, {
        success: true,
        data: result,
      });
    }
  }

  sendMessage(eventName: string, clientId: string, data: Object | string) {
    if (typeof data !== "string") {
      data = JSON.stringify(data);
    }

    this.server.to(clientId).emit(eventName, data);
  }
}
