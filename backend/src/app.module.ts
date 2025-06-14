import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
