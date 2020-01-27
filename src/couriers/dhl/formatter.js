import moment from 'moment-timezone'

const stepMatcher = {
  "Arrivée à l'agence DHL de ": "Arrivée à l'agence DHL",
  'Arrivée au centre de tri DHL de ': 'Arrivée au centre de tri DHL',
  'Dédouanement accompli à ': 'Dédouanement accompli',
  'En cours de dédouanement à ': 'En cours de dédouanement',
  'Transféré via ': 'Transféré',
  "Partie de l'agence DHL de ": "Partie de l'agence DHL",
  "Traitée à l'agence DHL de ": "Traitée à l'agence DHL"
}

const format = function dhlFormatter (data) {
  let iterator = []
  let dateParse

  if (data.checkpoints) {
    iterator = data.checkpoints
    dateParse = 'dddd, MMMM DD, YYYY HH:mm'
  } else if (data.events) {
    iterator = data.events
    dateParse = 'YYYY-MM-DD HH:mm:ss'
  }

  const steps = []

  for (const step of iterator) {
    const stepData = Object.keys(stepMatcher).reduce(
      (acc, stepMatch, i) => {
        if (acc.status.indexOf(stepMatch) !== -1) {
          const statusMatch = acc.status.match(new RegExp(`^${stepMatch}(.*)$`))

          if (statusMatch) {
            acc = statusMatch.reduce(
              (_acc, match, i) => {
                if (i === 0) {
                  _acc.status = stepMatcher[stepMatch]
                } else if (!acc.location && i === 1 && typeof match === 'string') {
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
        status: step.description.trim(),
        location: (step.location && step.location.trim()) || null
      }
    )

    steps.push({
      // @TODO: Make sure timezone is Paris
      datetime: +moment.tz(`${step.date.trim()} ${step.time.trim()}`, dateParse, 'fr', 'Europe/Paris'),
      ...stepData
    })
  }

  return steps
}

export default format
