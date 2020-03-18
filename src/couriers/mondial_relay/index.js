import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import format from './formatter'
import scrape from './scraper'

const makeOpts = (number, zipCode) => {
  let url

  if (zipCode) {
    url = `http://www.mondialrelay.fr/suivi-de-colis?codePostal=${zipCode}&numeroExpedition=${number}`
  } else {
    url = `http://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${number}`
  }

  return {
    method: 'get',
    url,
    responseType: 'text'
  }
}

class MondialRelay extends Courier {
  async track (number, log) {
    super.track(number, log)

    const [_number, zipCode] = number.split(':')

    if (_number.length === 8) {
      this.log('testing for zip code presence')

      if (!zipCode) {
        this.log('zip code missing')

        throw errors.zipCode
      }
    }

    this.log('performing http call to retrieve tracking data')

    const response = await axios(makeOpts(_number, zipCode)).catch((err) => {
      this.log('failed to retrieve tracking data')
      this.log(err)

      if (err.response && err.response.status === 404 && err.response.data) {
        throw errors.notFound
      }

      throw errors.internal.call(this, err)
    })

    const parcel = Parcel({
      id: number,
      courier: this.id,
      steps: format(scrape(response.data, this.log), this.log)
    })

    this.log('tracking result')
    this.log(parcel)

    return parcel
  }
}

const mondialRelay = new MondialRelay('MONDIAL_RELAY', 'Mondial Relay', [
  /\b(\w{7}[A-Z])\b/i, // AB01234D
  /\b(\d{14,15})\b/i, // 01234567890123 or 012345678901234
  /\b(\d{10,12})\b/i, // 0123456789 or 01234567890 or 012345678901
  /\b(\d{20})\b/i, // 01234567890123456789
  /\b(\w{2}\d{9}\w{2})\b/i // 7D012345678D2
])

export default mondialRelay
