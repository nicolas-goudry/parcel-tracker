import moment from 'moment-timezone'

const format = function colissimoFormatter (data) {
  const steps = []

  for (const step of data) {
    steps.push({
      status: step.label,
      location: null,
      datetime: +moment.tz(step.date, null, 'fr', 'Europe/Paris')
    })
  }

  return steps
}

export default format
