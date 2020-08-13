import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { Polly } from '@pollyjs/core'
import { setupPolly } from 'setup-polly-jest'

import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'

import { FileService } from './file.service'
import { GqlClientService } from '../gqlClient/gqlClient.service'
import { FileObjectDTO } from '../dtos/fileobject.dto'
import { FileDTO } from '../dtos/file.dto'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

describe('FileService', () => {
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

  let fileService: FileService

  const fileObject: FileObjectDTO = {
    location: 's3://minio-1.nyu.edu/cas',
    size: 483187,
    sha1: '31785c4790839fe07d87532f4924c8de',
    sha256: '4e345ccfd43c19220af3faa2e53f0a2d6d1c0953',
    md5: 'daacf8fae60070dc23194e9bd1dcc732d009fed8ae25aaf7410e625ca2a66d70'
  }

  const file: FileDTO = {
    name: 'Dummy File name',
    uploadedById: 1,
    fileobjectId: 1,
    assetId: 1,
    fileFormatId: 'pdf'
  }

  let fakeFileObject: FileObjectDTO = null
  let fakeFile: FileDTO = null

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['../.env'],
          isGlobal: true
        })
      ],
      providers: [
        FileService,
        GqlClientService
      ]
    }).compile()

    fileService = moduleRef.get<FileService>(FileService)
  })

  beforeEach(() => {
    fakeFileObject = Object.assign({}, fileObject)
    fakeFile = Object.assign({}, file)
  })

  describe('insertFileObject', () => {
    it('Should insert a fileObject and return its id', async () => {
      expect(await fileService.insertFileObject(fakeFileObject)).toBe(1)
    })

    it('Should throw an error when the fileObject is not defined', async () => {
      await expect(fileService.insertFileObject(null)).rejects.toThrow()
      await expect(fileService.insertFileObject(undefined)).rejects.toThrow()
    })

    it('Should throw a GQL error if the location key is not defined', async () => {
      fakeFileObject.location = null
      await expect(fileService.insertFileObject(fakeFileObject)).rejects.toThrow()
    })

    it('Should throw a GQL error if the md5 key is not defined', async () => {
      fakeFileObject.md5 = null
      await expect(fileService.insertFileObject(fakeFileObject)).rejects.toThrow()
    })

    it('Should throw a GQL error if the sha1 key is not defined', async () => {
      fakeFileObject.sha1 = null
      await expect(fileService.insertFileObject(fakeFileObject)).rejects.toThrow()
    })

    it('Should throw a GQL error if the sha256 key is not defined', async () => {
      fakeFileObject.sha256 = null
      await expect(fileService.insertFileObject(fakeFileObject)).rejects.toThrow()
    })

    it('Should throw a GQL error if the size key is not defined', async () => {
      fakeFileObject.size = null
      await expect(fileService.insertFileObject(fakeFileObject)).rejects.toThrow()
    })
  })

  describe('insertFile', () => {
    it('Should return a new file object', async () => {
      expect(await fileService.insertFile(fakeFile)).toBeInstanceOf(FileDTO)
    })

    it('Should throw an error when the file is not defined', async () => {
      await expect(fileService.insertFile(null)).rejects.toThrow()
      await expect(fileService.insertFile(undefined)).rejects.toThrow()
    })

    it('Should throw a GQL error if the assetId key is not defined', async () => {
      fakeFile.assetId = null
      await expect(fileService.insertFile(fakeFile)).rejects.toThrow()
    })

    it('Should throw a GQL error if the fileFormatId key is not defined', async () => {
      fakeFile.fileFormatId = null
      await expect(fileService.insertFile(fakeFile)).rejects.toThrow()
    })

    it('Should throw a GQL error if the fileobjectId key is not defined', async () => {
      fakeFile.fileobjectId = null
      await expect(fileService.insertFile(fakeFile)).rejects.toThrow()
    })

    it('Should throw a GQL error if the name key is not defined', async () => {
      fakeFile.name = null
      await expect(fileService.insertFile(fakeFile)).rejects.toThrow()
    })

    it('Should throw a GQL error if the uploadedById key is not defined', async () => {
      fakeFile.uploadedById = null
      await expect(fileService.insertFile(fakeFile)).rejects.toThrow()
    })
  })
})
