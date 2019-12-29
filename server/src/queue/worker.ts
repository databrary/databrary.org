import boss from './config'

async function runUnit (params) {
  console.log('Running', params.data)
  const input = params.data
  const unitName = input.unit
  delete input['unit']
  const pkg = await import(`../tasks/${unitName}`)
  const unit = pkg.default
  console.log('Running', unit)
  try {
    const result = await unit(input)
    console.log('Finished', result)
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
