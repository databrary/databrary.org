// import processMinioUpload from './src/tasks/processMinioUpload'
import processMinioUpload from './src/tasks/processMinioUpload'

async function main () {
  await processMinioUpload({
    key: '15',
    eTag: '26111a017f7f6548dc9941d202677aa2-1',
    size: 5017021,
    unit: 'processMinioUpload',
    sequencer: '15E4BFD9BA80F57C',
    versionId: '1',
    contentType: 'application/x-zip-compressed',
    userMetadata: { 'content-type': 'application/x-zip-compressed' }
  })
}

main()
