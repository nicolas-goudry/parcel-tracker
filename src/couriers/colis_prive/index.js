import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import format from './formatter'
import scrape from './scraper'

const makeOpts = (number, zipCode) => {
  return {
    method: 'post',
    url: 'https://www.colisprive.com/moncolis/colis-iframe.aspx',
    params: {
      identifiant: number,
      cp: zipCode
    }
  }
}

class ColisPrive extends Courier {
  async track (number, opts) {
    super.track(number)

    const [_number, zipCode] = number.split(':')

    if (!zipCode) {
      throw errors.zipCode
    }

    const response = await axios(makeOpts(_number, zipCode)).catch((err) => {
      throw errors.internal.call(this, err)
    })

    return new Parcel(number, this.id, format(scrape(response.data)), opts)
  }
}

const colisPrive = new ColisPrive('COLIS_PRIVE', 'Colis Privé', [
  /\b(\d{17})\b/i // 00000000000000000
])

export default colisPrive
