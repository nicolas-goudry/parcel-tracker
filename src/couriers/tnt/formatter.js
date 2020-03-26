import cheerio from 'cheerio'
import moment from 'moment-timezone'

const format = function tntFormatter (data, log) {
  log('formatting data')

  const steps = []

  if (data.events) {
    for (const step of data.events) {
      steps.push({
        location: step.location.city || null,
        datetime: +moment.tz(step.date, null, 'fr', 'Europe/Paris'),
        status: step.statusDescription
      })
    }
  } else {
    data.each((i, step) => {
      const $step = cheerio(step)
      const dateTime = $step
        .children('.roster__item:nth-child(2)')
        .text()
        .replace(/\s+/g, ' ')
        .trim()
      const location = $step
        .children('.roster__item:last-child')
        .text()
        .replace(/\s+/g, ' ')
        .trim()
      const status = $step
        .children('.roster__item:first-child')
        .text()
        .replace(/\s+/g, ' ')
        .trim()

      steps.push({
        datetime: +moment.tz(
          dateTime,
          'DD/MM/YYYY HH:mm',
          'fr',
          'Europe/Paris'
        ),
        location: location || null,
        status
      })
    })
  }

  return steps
}

export default format
