import cheerio from 'cheerio'
import moment from 'moment-timezone'

const format = function dpdFormatter (data, log) {
  log('formatting data')

  const steps = []

  if (data.scan) {
    let j = data.scan.length - 1

    data.scan.forEach((step) => {
      steps[j] = {
        location: step.scanData.location,
        status: step.scanDescription.content[0],
        // @TODO: Make sure timezone is Paris
        datetime: +moment.tz(
          step.date,
          'YYYY-MM-DDTHH:mm:ssZ',
          'fr',
          'Europe/Paris'
        )
      }

      j--
    })
  } else {
    data.each((i, step) => {
      const $step = cheerio(step)
      const date = $step.children('td[id^=dateTableTrace]').text()
      const time = $step.children('td[id^=heureTableTrace]').text()
      const locationText = $step.children('td[id^=lieuTableTrace]').text()
      const locationRegexp = locationText.match(
        /(Agence DPD de|Centre de tri DPD de) (.*) \(.*\)/i
      )
      const status = $step
        .children('td[id^=statutTableTrace]')
        .text()
        .replace(/\s+/g, ' ')
        .trim()
      let location = null

      if (locationRegexp) {
        location = locationRegexp[2] || null
      }

      steps.push({
        // @TODO: Make sure timezone is Paris
        datetime: +moment.tz(
          `${date} ${time}`,
          'DD/MM/YYYY HH:mm',
          'fr',
          'Europe/Paris'
        ),
        location,
        status
      })
    })
  }

  return steps
}

export default format
