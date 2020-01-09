import axios from 'axios'
import omit from 'lodash.omit'

import chronopost from '../chronopost'
import format from './formatter'
import scrape from './scraper'
import errors from '../../utils/errors'

export const metadata = {
  id: 'COLISSIMO',
  label: 'Colissimo',
  matcher: [
    /\b(\w{2}\d{9}\w{2})\b/i // 0A012345678A9
  ]
}

const fetchParams = async (number) => {
  // We make a useless request to get JWT token
  const butterRequest = await axios({
    method: 'get',
    url: 'https://www.laposte.fr/outils/suivre-vos-envois'
  })
  const [accessToken] = butterRequest.headers['set-cookie'].map((val) => val.split(';')[0])

  if (accessToken) {
    return {
      method: 'get',
      url: `https://api.laposte.fr/ssu/v1/suivi-unifie/idship/${number}?lang=fr_FR`,
      headers: {
        Cookie: `${accessToken};`,
        Accept: 'application/json'
      },
      responseType: 'json'
    }
  }

  throw Error('Could not get access token')
}

const track = async (number) => {
  const params = await fetchParams(number)
  let response

  try {
    response = await axios(params)
  } catch (err) {
    if (err.response && (err.response.status === 404 || err.response.status === 400)) {
      throw errors.notFound
    }

    throw err
  }

  if (response.data && response.data.shipment && response.data.shipment.product === 'chronopost') {
    return chronopost(number)
  }

  return {
    ...omit(metadata, 'matcher'),
    number,
    steps: format(scrape(response.data))
  }
}

export default track
