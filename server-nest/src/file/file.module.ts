import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { GqlClientModule } from 'src/gqlClient/gqlClient.module'

@Module({
  imports: [GqlClientModule],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule {}
