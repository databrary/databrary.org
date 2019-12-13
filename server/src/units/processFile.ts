import { Client } from 'minio'

const s3Client = new Client({
  endPoint: 'localhost', // TODO(Reda): Need to change this endpoint
  port: 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

s3Client.statObject('uploads', 'dims.jpg', function (err, stat) {
  if (err) {
    return console.log(err)
  }
  console.log(stat)
})
