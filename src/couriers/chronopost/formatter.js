import get from 'lodash.get'
import moment from 'moment-timezone'

const format = function chronopostFormatter (data, log) {
  log('formatting data')

  const steps = []

  for (const step of data) {
    const status = get(step, 'Libelle[0]')
    const statusCode = get(step, 'Code_Etat[0]').trim()

    if (status && statusCode !== 'IM' && statusCode !== 'SM') {
      let location = null

      if (get(step, 'Numero_Poste_Comptable[0]') !== 'CFR') {
        const zipCode = get(step, 'CP[0]')

        if (zipCode && zipCode.trim()) {
          location = get(step, 'Bureau[0]', null)
        } else if (step.Information_Complementaire) {
          const locInfComp = step.Information_Complementaire.filter((inf) => {
            return inf.$.nom === 'Lieu'
          })

          location = get(locInfComp, '[0]._', null)
        }
      }

      steps.push({
        datetime: +moment.tz(`${step.Date[0]} ${step.Heure[0]}`, 'dddd DD/MM/YYYY HH:mm', 'fr', 'Europe/Paris'),
        status: step.Libelle[0],
        location
      })
    }
  }

  return steps
}

export default format
