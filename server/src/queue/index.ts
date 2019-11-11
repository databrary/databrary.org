import boss from './config'

let bossQueue = null

async function setup () {
  if (bossQueue === null) {
    bossQueue = await boss.start()
  }
}

export default async function queue (functionName: string, input: object, queue: string = 'main') {
  await setup()
  input['unit'] = functionName
  const id = await bossQueue.publish(queue, input)
  return id
}
