import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import format from './formatter'
import scrape from './scraper'

const makeOpts = (number) => {
  return {
    method: 'get',
    url: `https://gls-group.eu/app/service/open/rest/FR/fr/rstt001?match=${number}`,
    responseType: 'json'
  }
}

class GLS extends Courier {
  async track (number, opts) {
    super.track(number)

    const response = await axios(makeOpts(number)).catch((err) => {
      if (err.response && err.response.status === 404 && err.response.data) {
        throw errors.notFound
      }

      throw errors.internal.call(this, err)
    })

    return new Parcel(number, this.id, format(scrape(response.data, this.errors)), opts)
  }
}

const gls = new GLS('GLS', 'GLS', [
  /\b(\w{7}[A-Z])\b/i, // AB01234D
  /\b(\d{14,15})\b/i, // 01234567890123 or 012345678901234
  /\b(\d{10,12})\b/i, // 0123456789 or 01234567890 or 012345678901
  /\b(\d{20})\b/i, // 01234567890123456789
  /\b(\w{2}\d{9}\w{2})\b/i // 7D012345678D2
])

export default gls
