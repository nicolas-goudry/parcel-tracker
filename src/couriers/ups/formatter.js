import he from 'he'

import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  for (const step of data) {
    if (step.activityScan) {
      steps.push({
        datetime: parseDatetime(`${step.date} ${step.time}`, 'DD/MM/YYYY HH:mm', 'fr'),
        location: step.location,
        activity: he.decode(step.activityScan)
      })
    }
  }

  return steps
}

export default format
