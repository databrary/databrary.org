import boss from './config'

async function runUnit (params) {
  const input = params.data
  const unitName = input.unit
  delete input['unit']
  const pkg = await import(`../tasks/${unitName}`)
  const unit = pkg.default
  try {
    const result = await unit(input)
    params.done(null, result)
  } catch (err) {
    params.done(err, null)
  }
}

export default async function worker (queue: string = 'main') {
  await boss.connect()
  console.log('connected')
  await boss.subscribe(queue, runUnit)
}
