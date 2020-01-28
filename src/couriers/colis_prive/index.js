import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import format from './formatter'
import scrape from './scraper'

const makeOpts = (number) => {
  const [identifiant, cp] = number.split(':')

  if (!cp) {
    throw errors.zipCode
  }

  return {
    method: 'post',
    url: 'https://www.colisprive.com/moncolis/colis-iframe.aspx',
    params: {
      identifiant,
      cp
    }
  }
}

class ColisPrive extends Courier {
  async track (number, opts) {
    super.track(number)

    const response = await axios(makeOpts(number)).catch(errors.internalInvariant.bind(this))

    return new Parcel(number, this.id, format(scrape(response.data, this.errors)), opts)
  }
}

const colisPrive = new ColisPrive('COLIS_PRIVE', 'Colis Privé', [
  /\b(\d{17})\b/i // 00000000000000000
])

export default colisPrive
