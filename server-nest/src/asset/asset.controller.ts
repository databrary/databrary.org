import { Controller, Get, Param } from '@nestjs/common'
import { MinioService } from '../minio/minio.service'
import { AssetService } from './asset.service'

@Controller('asset')
export class AssetController {
  constructor (
    private readonly assetService: AssetService,
    private readonly minioService: MinioService
  ) {}

  @Get(':id')
  async getAssetUrl (@Param('id') id: number): Promise<Record<string, string>> {
    try {
      const { name, format } = await this.assetService.getAssetSHA(id)

      if (name == null || format == null) throw new Error('Cannot find asset name')

      const assetPresignedUrl = await this.minioService.getPresignedUrl('cas', name)
      return {
        url: assetPresignedUrl,
        format: format
      }
    } catch (error) {
      console.error(error.message)
    }
  }
}
