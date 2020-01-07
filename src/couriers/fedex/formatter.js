import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  for (const step of data.scanEventList) {
    steps.push({
      activity: step.status,
      location: step.scanLocation || '',
      datetime: parseDatetime(`${step.date} ${step.time}`, 'YYYY-MM-DD HH:mm:ss', 'fr')
    })
  }

  return steps
}

export default format
