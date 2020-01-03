import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []

  for (const step of data) {
    if (
      step.Libelle &&
      step.Libelle[0] &&
      step.Code_Etat &&
      step.Code_Etat[0].trim() !== 'IM' &&
      step.Code_Etat[0].trim() !== 'SM'
    ) {
      let location = null

      if (step.Numero_Poste_Comptable && step.Numero_Poste_Comptable[0] !== 'CFR') {
        if (step.CP && step.CP[0] && step.CP[0].trim()) {
          location = step.Bureau[0]
        } else if (step.Information_Complementaire) {
          const locInfComp = step.Information_Complementaire.filter((inf) => inf.$.nom === 'Lieu')

          if (locInfComp[0] && locInfComp[0]._) {
            location = locInfComp[0]._
          }
        }
      }

      steps.push({
        datetime: parseDatetime(`${step.Date[0]} ${step.Heure[0]}`, 'dddd DD/MM/YYYY HH:mm', 'fr'),
        status: step.Libelle[0],
        location
      })
    }
  }

  return steps
}

export default format
