import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

@Processor('QUEUE')
export class TaskProcessor {

  @Process('upload')
  handleUpload(job: Job) {
    console.log('Start upload...')
    console.log(job.data)

    // if (bucketName === 'avatars') {
    //     assetId = await this.userService.insertAvatarAsset(id);
    //     // Maybe This should be added in the webhook
    //     await this.userService.updateUserAvatar(id, assetId);
    // }

    // const filename = await this.fileService.insertFile(name, id, assetId, format);

    console.log('Upload completed')
  }
}