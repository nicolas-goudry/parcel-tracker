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
      url: `https://www.logistics.dhl/shipmentTracking?countryCode=FR&languageCode=fr&AWB=${number}`,
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'Accept-Language': 'fr-FR'
      },
      responseType: 'json'
    },
    {
      method: 'get',
      url: `https://www.logistics.dhl/v1/mailitems/track?number=${number}`,
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'Accept-Language': 'fr-FR'
      },
      responseType: 'json'
    }
  ]
}

class DHL extends Courier {
  async track (number, log) {
    super.track(number, log)

    this.log('performing multiple http calls...')

    let steps
    let error

    for (const axiosOpts of makeOpts(number)) {
      try {
        this.log('performing http call to retrieve tracking data')

        const response = await axios(axiosOpts)

        steps = format(scrape(response.data, this.log), this.log)

        this.log('data retrieved')

        break
      } catch (err) {
        error = err
      }
    }

    if (error && !steps) {
      this.log('failed to retrieve tracking data')
      this.log(error)

      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 503)
      ) {
        throw errors.notFound
      }

      if (error.message !== 'notFound' && error.message !== 'noData') {
        throw errors.internal.call(this, error)
      }

      throw error
    }

    const parcel = Parcel({
      id: number,
      courier: this.id,
      steps
    })

    this.log('tracking result')
    this.log(parcel)

    return parcel
  }
}

const dhl = new DHL('DHL', 'DHL', [
  /\b(\d{10})\b/i, // 0000000000
  /\b(\w{4}\d{20})\b/i // XXXX00000000000000000000
])

export default dhl
