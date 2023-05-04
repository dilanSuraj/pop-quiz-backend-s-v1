import { Module } from '@nestjs/common';
import { AdminServicesService } from './admin-courses.service';
import { AdminServicesController } from './admin-courses.controller';
import { SlugGeneratorModule } from 'src/slug-generator/slug-generator.module';
import { EmailModule } from 'src/email/email.module';
import { SearchModule } from 'src/search/search.module';
import { ServicesModule } from 'src/services/services.module';
import { SlackModule } from 'src/slack/slack.module';
import { PushNotificationsModule } from 'src/push-notifications/push-notifications.module';

@Module({
    providers: [AdminServicesService],
    controllers: [AdminServicesController],
    imports: [SlugGeneratorModule, EmailModule, SearchModule, ServicesModule, SlackModule, PushNotificationsModule],
})
export class AdminServicesModule {}
