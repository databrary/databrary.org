import boss from './config'
import { logger } from '@shared'

async function runUnit (params) {
  logger.debug('Running', params.data)
  const input = params.data
  const unitName = input.unit
  delete input['unit']
  const pkg = await import(`../tasks/${unitName}`)
  const unit = pkg.default
  logger.debug('Running', unit)
  try {
    const result = await unit(input)
    logger.debug('Finished', result)
    params.done(null, result)
  } catch (err) {
    params.done(err, null)
  }
}

export default async function worker (queue: string = 'main') {
  await boss.connect()
  logger.info('Worker connected')
  await boss.subscribe(queue, runUnit)
}
