import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import format from './formatter'
import scrape from './scraper'

const makeOpts = (number) => {
  return [
    {
      method: 'get',
      url: `https://tracking.dpd.de/rest/plc/fr_FR/${number}`,
      responseType: 'json'
    },
    {
      method: 'get',
      url: `http://www.dpd.fr/trace/${number}`,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
      },
      responseType: 'text'
    }
  ]
}

class DPD extends Courier {
  async track(number, opts) {
    super.track(number)

    let steps
    let error

    for (const axiosOpts of makeOpts(number)) {
      try {
        const response = await axios(axiosOpts)

        steps = format(scrape(response.data))

        break
      } catch (err) {
        error = err
      }
    }

    if (error && !steps) {
      errors.internalInvariant(error)
    }

    return new Parcel(number, this.id, steps, opts)
  }
}

const dpd = new DPD('DPD', 'DPD', [
  /\b(\d{14,16})\b/i // 00000000000000, 000000000000000, 0000000000000000
])

export default dpd
