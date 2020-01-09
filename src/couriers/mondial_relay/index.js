import axios from 'axios'
import omit from 'lodash.omit'

import format from './formatter'
import scrape from './scraper'
import errors from '../../utils/errors'

export const metadata = {
  id: 'MONDIAL_RELAY',
  label: 'Mondial Relay',
  matcher: [
    /\b(\d{8})\b/i, // 01234567
    /\b(\d{10})\b/i, // 0123456789
    /\b(\d{12})\b/i // 012345678901
  ]
}

const fetchParams = (number) => {
  const [trackingNumber, zipCode] = number.split(':')

  if (!zipCode) {
    throw errors.zipCode
  }

  return {
    method: 'get',
    url: `http://www.mondialrelay.fr/suivi-de-colis?codePostal=${zipCode}&numeroExpedition=${trackingNumber}`,
    responseType: 'text'
  }
}

const track = async (number) => {
  const response = await axios(fetchParams(number))

  return {
    ...omit(metadata, 'matcher'),
    number,
    steps: format(scrape(response.data))
  }
}

export default track
