import he from 'he'
import moment from 'moment-timezone'

const format = function upsFormatter (data) {
  const steps = []

  for (const step of data) {
    if (step.activityScan) {
      steps.push({
        datetime: +moment.tz(`${step.date} ${step.time}`, 'DD/MM/YYYY HH:mm', 'fr', 'Europe/Paris'),
        location: step.location,
        status: he.decode(step.activityScan)
      })
    }
  }

  return steps
}

export default format
