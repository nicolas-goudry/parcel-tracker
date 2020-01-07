import cheerio from 'cheerio'

import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  if (data.scan) {
    let j = data.scan.length - 1

    data.scan.forEach((step) => {
      steps[j] = {
        location: step.scanData.location,
        activity: step.scanDescription.content[0],
        datetime: parseDatetime(step.date, 'YYYY-MM-DDTHH:mm:ssZ', 'fr')
      }

      j--
    })
  } else {
    data.each((i, step) => {
      const $step = cheerio(step)
      const date = $step.children('td[id^=dateTableTrace]').text()
      const time = $step.children('td[id^=heureTableTrace]').text()
      const locationText = $step.children('td[id^=lieuTableTrace]').text()
      const locationRegexp = locationText.match(/(Agence DPD de|Centre de tri DPD de) (.*) \(.*\)/i)
      const activity = $step
        .children('td[id^=statutTableTrace]')
        .text()
        .replace(/\s+/g, ' ')
        .trim()
      let location = null

      if (locationRegexp) {
        location = locationRegexp[2] || null
      }

      steps.push({
        datetime: parseDatetime(`${date} ${time}`, 'DD/MM/YYYY HH:mm', 'fr'),
        location,
        activity
      })
    })
  }

  return steps
}

export default format
