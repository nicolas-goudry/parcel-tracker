import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import chronopost from '../chronopost'
import format from './formatter'
import scrape from './scraper'
import get from 'lodash.get'

const makeOpts = async (number) => {
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

  throw Error('Missing JWT access token')
}

class LaPoste extends Courier {
  async track (number, opts) {
    super.track(number)

    const axiosOptions = await makeOpts(number).catch((err) => {
      throw errors.internal.call(this, err)
    })
    const response = await axios(axiosOptions).catch((err) => {
      const status = get(err, 'response.status')

      if ((status === 404 || status === 400) && err.response.data) {
        throw errors.notFound
      }

      throw errors.internal.call(this, err)
    })

    if (response.data && response.data.shipment && response.data.shipment.product === 'chronopost') {
      return chronopost.track(number, opts)
    }

    return new Parcel(number, this.id, format(scrape(response.data)), opts)
  }
}

const laPoste = new LaPoste('LA_POSTE', 'La Poste', [
  /\b(\w{2}\d{9}\w{2})\b/i // 0A012345678A9
])

export default laPoste
