import cheerio from 'cheerio'

import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  if (data.events) {
    for (const step of data.events) {
      steps.push({
        location: step.location.city || null,
        datetime: parseDatetime(step.date, null, 'fr'),
        activity: step.statusDescription
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
      const activity = $step
        .children('.roster__item:first-child')
        .text()
        .replace(/\s+/g, ' ')
        .trim()

      steps.push({
        datetime: parseDatetime(dateTime, 'DD/MM/YYYY HH:mm', 'fr'),
        location: location || null,
        activity
      })
    })
  }

  return steps
}

export default format
