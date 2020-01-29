import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import format from './formatter'
import scrape from './scraper'

const makeOpts = (number) => {
  return {
    method: 'post',
    url: 'https://www.ups.com/track/api/Track/GetStatus?loc=fr_FR',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      Locale: 'fr_FR',
      TrackingNumber: [number]
    },
    responseType: 'json'
  }
}

class UPS extends Courier {
  async track (number, opts) {
    super.track(number)

    const response = await axios(makeOpts(number)).catch((err) => {
      throw errors.internal.call(this, err)
    })

    return new Parcel(number, this.id, format(scrape(response.data)), opts)
  }
}

const ups = new UPS('UPS', 'UPS', [
  /\b(\w\d{10})\b/i, // A0123456789
  /\b(\d{26})\b/i, // 01234567890123456789012345
  /\b(\d{18})\b/i, // 012345678901234567
  /\b(\d{9})\b/i, // 012345678
  /\b(1Z\w{16})\b/i // 1Z0123456789ABCDEF
])

export default ups
