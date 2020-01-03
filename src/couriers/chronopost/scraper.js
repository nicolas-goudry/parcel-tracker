import { promisify } from 'util'
import { parseString } from 'xml2js'

import errors from '../../utils/errors'

const xml2js = promisify(parseString)

const scrape = async (data) => {
  if (!data) {
    throw errors.input
  }

  const parsedData = await xml2js(data)
  const report = parsedData.Rapport
  const response = parsedData.Reponse && parsedData.Reponse.Objet && parsedData.Reponse.Objet[0]

  if (report && report.Code_Erreur && report.Code_Erreur[0]) {
    throw Error(report.Code_Erreur[0])
  } else if (response && response.Code_Erreur && response.Code_Erreur[0] === 'MSG_AUCUN_EVT') {
    throw errors.notFound
  } else if (response && response.Code_Erreur && response.Code_Erreur[0]) {
    throw Error(response.Code_Erreur[0])
  } else if (response && response.Evenement) {
    return response.Evenement
  }

  throw errors.notFound
}

export default scrape
