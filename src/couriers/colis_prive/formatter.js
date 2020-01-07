import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  for (const step of data) {
    steps.push({
      datetime: parseDatetime(step.children('td:first-child').text(), 'DD/MM/YYYY', 'fr'),
      location: '',
      activity: step.children('td:last-child').text()
    })
  }

  return steps
}

export default format
