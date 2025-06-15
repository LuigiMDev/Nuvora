import { Module } from "@nestjs/common";
import { RepositoriesModule } from "src/repositories/repositories.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [RepositoriesModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}