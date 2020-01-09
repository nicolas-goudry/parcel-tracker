import axios from 'axios'
import omit from 'lodash.omit'

import format from './formatter'
import scrape from './scraper'
import errors from '../../utils/errors'

export const metadata = {
  id: 'MONDIAL_RELAY',
  label: 'Mondial Relay',
  matcher: [
    /\b(\d{8})\b/i, // 01234567 ==> requires zip code
    /\b(\d{10})\b/i, // 0123456789
    /\b(\d{12})\b/i // 012345678901
  ]
}

const fetchParams = (number) => {
  const [trackingNumber, zipCode] = number.split(':')
  let url

  if (trackingNumber.length === 8) {
    if (!zipCode) {
      throw errors.zipCode
    }

    url = `http://www.mondialrelay.fr/suivi-de-colis?codePostal=${zipCode}&numeroExpedition=${trackingNumber}`
  } else {
    url = `http://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${trackingNumber}`
  }

  return {
    method: 'get',
    url,
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
