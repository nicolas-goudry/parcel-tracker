import get from 'lodash.get'
import { promisify } from 'util'
import { parseString } from 'xml2js'

import errors from '../../utils/errors'

const xml2js = promisify(parseString)

const scrape = async function chronopostScraper (data) {
  if (!data) {
    throw errors.noData
  }

  const parsedData = await xml2js(data)

  if (get(parsedData, 'Rapport.Erreur[0].Code[0]') === 'MSG_AUCUN_NUMERO_LT') {
    throw errors.notFound
  }

  if (get(parsedData, 'Reponse.Objet[0].Code_Erreur[0]') === 'MSG_AUCUN_EVT') {
    throw errors.notFound
  }

  return get(parsedData, 'Reponse.Objet[0].Evenement')
}

export default scrape
