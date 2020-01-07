import { parseDatetime } from '../../utils/datetime'

const format = (data) => {
  const steps = []
  let j = data.historiquesExpedition.length - 1

  for (const step of data.historiquesExpedition) {
    if (
      step.codeSituationJustification.indexOf('LIV') !== -1 ||
      step.codeSituationJustification.indexOf('MLV') !== -1
    ) {
      step.libelleAgenceTraitante = data.destinataire.ville || step.libelleAgenceTraitante
    }

    steps[j] = {
      location: step.libelleAgenceTraitante,
      activity: step.libelleSituationJustification,
      datetime: parseDatetime(`${step.dateSituation} ${step.heureSituation}`, 'YYYY-MM-DD HH:mm:ss', 'fr')
    }

    j--
  }

  return steps
}

export default format
