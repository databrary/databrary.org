import { Controller, Get, Post, Request, Session, Res } from '@nestjs/common';
import { UserService } from 'src/users/user.service'
import { MinioService } from './minio.service'
import { FileService } from 'src/file/file.service'

@Controller('minio')
export class MinioController {

    constructor(
        private readonly userService: UserService,
        private readonly minioService: MinioService,
        private readonly fileService: FileService
    ) {}

    @Post('webhook')
    async webhook(@Request() req, @Res() res, @Session() { user }) {
        console.log(`File added ${JSON.stringify(req.body)}`);
        res.status(201).send()
    }

    @Post('sign-upload')
    async signedUpload(
        @Res() res,
        @Request() { body: { contentType, filename } }, 
        @Session() { user: { id }}
    ) {
        try {
            let bucketName = 'uploads';
        
            const bucketFound = await this.minioService.bucketExists(bucketName)

            if (bucketFound) {
                // if (bucketName === 'avatars') {
                //     assetId = await this.userService.insertAvatarAsset(id);
                //     // Maybe This should be added in the webhook
                //     await this.userService.updateUserAvatar(id, assetId);
                // }
    
                // const filename = await this.fileService.insertFile(name, id, assetId, format);

                // Send signed url
                this.minioService.client.presignedPutObject(
                    bucketName,
                    encodeURIComponent(filename),
                    1000,
                    function (err, presignedUrl) {
                        if (err) return console.log(err)
                        res.json({
                            url: presignedUrl,
                            method: 'put',
                            fields: [],
                            headers: {
                                'content-type': contentType,
                                'x-amz-meta-user-id': id
                            }
                        })
                    }
                )
            }
        } catch (error) {
            console.error(error)
        }
    }
}
