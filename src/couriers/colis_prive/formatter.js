import cheerio from 'cheerio'

import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  data.each((i, step) => {
    const $step = cheerio(step)

    steps.push({
      datetime: parseDatetime($step.children('td:first-child').text(), 'DD/MM/YYYY', 'fr'),
      location: '',
      status: $step.children('td:last-child').text()
    })
  })

  return steps
}

export default format
