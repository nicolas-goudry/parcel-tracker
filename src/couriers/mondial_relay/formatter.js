import cheerio from 'cheerio'
import moment from 'moment-timezone'

const stepMatcher = {
  'Prise en charge en agence ': 'Prise en charge en agence'
}

const format = function mondialRelayFormatter (data, log) {
  log('formatting data')

  const steps = []

  data.each((i, step) => {
    const $step = cheerio(step)
    const day = $step
      .parents('.infos-account')
      .find('.infos-colis :nth-child(3) strong')
      .text()
    const time = $step
      .children('div:first-child')
      .find('p')
      .text()

    if (time.trim()) {
      const stepData = Object.keys(stepMatcher).reduce(
        (acc, stepMatch) => {
          if (!acc.location && acc.status.indexOf(stepMatch) !== -1) {
            const statusMatch = acc.status.match(new RegExp(`^${stepMatch}(.*)$`))

            if (statusMatch) {
              acc = statusMatch.reduce(
                (_acc, match, i) => {
                  if (i === 0) {
                    _acc.status = stepMatcher[stepMatch]
                  } else if (i === 1 && typeof match === 'string') {
                    _acc.location = match.replace(/[.]/g, '').trim()
                  }

                  return _acc
                },
                {
                  status: acc.status,
                  location: acc.location
                }
              )
            }
          }

          return acc
        },
        {
          status: $step
            .children('div:nth-child(2)')
            .find('p')
            .text(),
          location: null
        }
      )

      steps.push({
        ...stepData,
        datetime: +moment.tz(`${day} ${time}`, 'DD/MM/YYYY HH:mm', 'fr', 'Europe/Paris')
      })
    }
  })

  return steps
}

export default format
