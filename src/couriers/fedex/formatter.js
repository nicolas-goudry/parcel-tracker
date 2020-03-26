import moment from 'moment-timezone'

const format = function fedexFormatter (data, log) {
  log('formatting data')

  const steps = []

  for (const step of data) {
    steps.push({
      status: step.status,
      location: step.scanLocation || null,
      datetime: +moment.tz(
        `${step.date} ${step.time}`,
        'YYYY-MM-DD HH:mm:ss',
        'fr',
        'Europe/Paris'
      )
    })
  }

  return steps
}

export default format
