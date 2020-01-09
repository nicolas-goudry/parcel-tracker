import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  for (const step of data) {
    steps.push({
      status: step.label,
      location: null,
      datetime: parseDatetime(step.date, null, 'fr')
    })
  }

  return steps
}

export default format
