import boss from './config'

let bossQueue = null

export async function setup () {
  if (bossQueue === null) {
    bossQueue = await boss.start()
  }
}

export default async function queue (functionName: string, input: object, queue: string = 'main') {
  input['unit'] = functionName
  const id = await bossQueue.publish(queue, input)
  return id
}
