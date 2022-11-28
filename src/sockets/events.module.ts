import { Module } from "@nestjs/common";
import { Global } from "@nestjs/common/decorators";
import { UserModule } from "../user/user.module";
import { EventsGateway } from "./events.gateway";

@Global()
@Module({
  imports: [UserModule],
  providers: [EventsGateway],
})
export class EventsModule {}
