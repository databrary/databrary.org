import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'

import { Polly } from '@pollyjs/core'
import { setupPolly } from 'setup-polly-jest'

import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import { MinioService } from './minio.service'
import { FileModule } from '../file/file.module'
import { UserModule } from '../users/user.module'
import { QueueModule } from '../queue/queue.module'
import { FileObjectDTO } from '../dtos/fileobject.dto'
import { MinioClient } from './minioClient'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

describe('MinioService', () => {
  setupPolly({
    adapters: ['node-http'],
    persister: 'fs',
    recordIfMissing: true,
    recordFailedRequests: true,
    persisterOptions: {
      fs: {
        recordingsDir: './recordings'
      }
    }
  })

  let minioService: MinioService

  const DUMMY_FILE_NAME = 'databrary.pdf'
  const DUMMY_FILE_SHA256 = 'daacf8fae60070dc23194e9bd1dcc732d009fed8ae25aaf7410e625ca2a66d70'
  const DUMMY_FILE_ETAG = '31785c4790839fe07d87532f4924c8de'

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['../.env'],
          isGlobal: true
        }),
        FileModule,
        UserModule,
        QueueModule
      ],
      providers: [
        MinioService,
        MinioClient
      ]
    }).compile()

    minioService = moduleRef.get<MinioService>(MinioService)
  })

  describe('bucketExists', () => {
    it('Should return true', async () => {
      expect(await minioService.bucketExists('uploads')).toBeTruthy()
      expect(await minioService.bucketExists('cas')).toBeTruthy()
      expect(await minioService.bucketExists('public')).toBeTruthy()
    })

    it('Should return false', async () => {
      expect(await minioService.bucketExists(null)).toBeFalsy()
      expect(await minioService.bucketExists(undefined)).toBeFalsy()
    })
  })

  describe('fileExists', () => {
    it('Should return true', async () => {
      expect(await minioService.fileExists('uploads', DUMMY_FILE_NAME)).toBeTruthy()
      expect(await minioService.fileExists('cas', DUMMY_FILE_SHA256)).toBeTruthy()
    })
    it('Should return false', async () => {
      expect(await minioService.fileExists('uploads', 'dummy_file.txt')).toBeFalsy()
      expect(await minioService.fileExists('cas', 'dummy-sha-256')).toBeFalsy()
      expect(await minioService.fileExists('cas', null)).toBeFalsy()
      expect(await minioService.fileExists('public', undefined)).toBeFalsy()
    })
  })

  describe('copyObject', () => {
    it('Should return true', async () => {
      expect(await minioService.copyObject('public', 'databrary-copoy.pdf', '/uploads/databrary.pdf', DUMMY_FILE_ETAG)).toBeTruthy()
    })

    it('Should throw an Error when the copy fails for any reason', async () => {
      await expect(minioService.copyObject('cas', 'fake_file.pdf', '/public/databrary_copy.pdf', DUMMY_FILE_NAME)).rejects.toThrow()
      await expect(minioService.copyObject('public', 'databrary-copoy.pdf', '/uploads/databrary.pdf', null)).rejects.toThrow()
      await expect(minioService.copyObject('uploads', null, null, null)).rejects.toThrow()
    })
  })

  describe('hashAndSizeMinio', () => {
    it('Should return a FileObjectDTO object', async () => {
      const fileObject = await minioService.hashAndSizeMinio('uploads', 'databrary.pdf')
      expect(fileObject).toBeInstanceOf(FileObjectDTO)
      expect(fileObject.location).toBeDefined()
      expect(fileObject.md5).toBeDefined()
      expect(fileObject.sha1).toBeDefined()
      expect(fileObject.sha256).toBeDefined()
      expect(fileObject.size).toBeDefined()
    })
  })
})
