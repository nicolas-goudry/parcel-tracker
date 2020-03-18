import cheerio from 'cheerio'
import moment from 'moment-timezone'

const format = function colisPriveFormatter (data, log) {
  log('formatting data')

  const steps = []

  data.each((i, step) => {
    const $step = cheerio(step)

    steps.push({
      datetime: +moment.tz($step.children('td:first-child').text(), 'DD/MM/YYYY', 'fr', 'Europe/Paris'),
      location: null,
      status: $step.children('td:last-child').text()
    })
  })

  return steps
}

export default format
