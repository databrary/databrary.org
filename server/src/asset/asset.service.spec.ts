import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'

import { Polly } from '@pollyjs/core'
import { setupPolly } from 'setup-polly-jest'

import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'

import { GqlClientService } from '../gqlClient/gqlClient.service'
import { AssetService } from './asset.service'
import { AssetDTO } from '../dtos/asset.dto'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

describe('AssetService', () => {
  setupPolly({
    adapters: ['node-http'],
    persister: 'fs',
    recordIfMissing: true,
    persisterOptions: {
      fs: {
        recordingsDir: './recordings'
      }
    }
  })

  let assetService: AssetService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['../.env'],
          isGlobal: true
        })
      ],
      providers: [
        AssetService,
        GqlClientService
      ]
    }).compile()

    assetService = moduleRef.get<AssetService>(AssetService)
  })

  describe('insertAsset', () => {
    it('Should return an Asset object', async () => {
      const asset = await assetService.insertAsset(new AssetDTO({
        assetType: 'project',
        name: 'Dummy project',
        privacyType: 'private',
        createdById: 1
      }))
      expect(asset).toBeInstanceOf(AssetDTO)
      expect(asset.id).toBeDefined()
      expect(typeof asset.id).toBe('number')
    })

    it('Should throw an error when asset is not defined', async () => {
      await expect(assetService.insertAsset(null)).rejects.toThrow()
      await expect(assetService.insertAsset(undefined)).rejects.toThrow()
    })
  })
})
