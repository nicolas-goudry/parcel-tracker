import moment from 'moment-timezone'

const format = function glsFormatter (data, log) {
  log('formatting data')

  const steps = []

  for (const step of data) {
    let location = null

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
