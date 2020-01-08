import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  for (const step of data) {
    let location = ''

    if (step.address && step.address.countryName) {
      if (step.address.city) {
        location = `${step.address.city}, ${step.address.countryName}`
      } else {
        location = `${step.address.countryName}`
      }
    }

    steps.push({
      location,
      status: step.evtDscr,
      datetime: parseDatetime(`${step.date} ${step.time}`, 'YYYY-MM-DD HH:mm:ss', 'fr')
    })
  }

  return steps
}

export default format
