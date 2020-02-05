import { Client } from 'minio'
// TODO(Reda): remove this file
import {
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY
} from '../config'

const s3Client = new Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

s3Client.statObject('uploads', 'dims.jpg', function (err, stat) {
  if (err) {
    return console.log(err)
  }
  console.log(stat)
})
