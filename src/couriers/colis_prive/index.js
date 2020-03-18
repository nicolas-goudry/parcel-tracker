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
  async track (number, log) {
    super.track(number, log)

    this.log('testing for zip code presence')

    const [num, zipCode] = number.split(':')

    if (!zipCode) {
      this.log('zip code missing')

      throw errors.zipCode
    }

    this.log('performing http call to retrieve tracking data')

    const response = await axios(makeOpts(num, zipCode)).catch((err) => {
      this.log('failed to retrieve tracking data')
      this.log(err)

      throw errors.internal.call(this, err)
    })

    this.log('data retrieved')

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

const colisPrive = new ColisPrive('COLIS_PRIVE', 'Colis Privé', [
  /\b(\d{17})\b/i // 00000000000000000
])

export default colisPrive
