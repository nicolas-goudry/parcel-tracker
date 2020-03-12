import axios from 'axios'

import Courier from '../../utils/Courier'
import Parcel from '../../utils/Parcel'
import errors from '../../utils/errors'
import format from './formatter'
import scrape from './scraper'

const makeOpts = (number) => {
  const params = new URLSearchParams()

  params.append(
    'data',
    `{"TrackPackagesRequest":{"appType":"WTRK","appDeviceType":"DESKTOP","uniqueKey":"","processingParameters":{},"trackingInfoList":[{"trackNumberInfo":{"trackingNumber":"${number}","trackingQualifier":"","trackingCarrier":""}}]}}`
  )
  params.append('action', 'trackpackages')
  params.append('locale', 'fr_FR')
  params.append('version', '1')
  params.append('format', 'json')

  return {
    method: 'post',
    url: 'https://www.fedex.com/trackingCal/track',
    data: params.toString(),
    responseType: 'json'
  }
}

class Fedex extends Courier {
  async track (number) {
    super.track(number)

    const response = await axios(makeOpts(number)).catch((err) => {
      throw errors.internal.call(this, err)
    })

    return Parcel({
      id: number,
      courier: this.id,
      steps: format(scrape(response.data))
    })
  }
}

const fedex = new Fedex('FEDEX', 'FedEx', [
  /\b(\d{10})\b/i, // 0000000000
  /\b(\d{12})\b/i, // 000000000000
  /\b(\d{15})\b/i, // 000000000000000
  /\b(\d{22})\b/i // 0000000000000000000000
])

export default fedex
