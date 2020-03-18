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
      url: `https://www.tnt.com/api/v3/shipment?searchType=CON&locale=fr_FR&con=${number}`,
      responseType: 'json'
    },
    {
      method: 'get',
      url: `https://www.tnt.fr/public/suivi_colis/recherche/visubontransport.do?radiochoixrecherche=BT&radiochoixtypeexpedition=NAT&bonTransport=${number}`,
      responseType: 'text'
    }
  ]
}

class TNT extends Courier {
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

const tnt = new TNT('TNT', 'TNT', [
  /\b(\d{9})\b/i, // 012345678
  /\b(\d{16})\b/i // 0123456789012345
])

export default tnt
